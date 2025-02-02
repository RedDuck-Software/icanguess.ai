import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { WordsService } from '../words/words.service';
import { PrismaService } from '../database/prisma.service';
import { SignaturesService } from '../signatures/signatures.service';
import { contractAddresses, GameMode, GameService } from '../game/game.service';
import { Address, keccak256 } from 'viem';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { ConfigService } from '@nestjs/config';

type GuessResponse = {
  word: string | null;
  temperature: number;
  wordIndex?: number;
};

@Injectable()
export class RoundService {
  private readonly chainId: number;

  constructor(
    private readonly aiService: AiService,
    private readonly prismaService: PrismaService,
    private readonly wordsService: WordsService,
    private readonly signaturesService: SignaturesService,
    private readonly gameService: GameService,
    private readonly configService: ConfigService,
  ) {
    this.chainId = Number(
      this.configService.get<string>('CHAIN_ID') || sepolia.id,
    );
  }

  async startRound(
    mode: GameMode,
  ): Promise<{ roundId: number; signature: Address; targetAddress: Address }> {
    const latestDbSession = await this.prismaService.round.findFirst({
      orderBy: { createdAt: 'desc' },
    });
    const latestDbSessionId = latestDbSession?.roundId ?? 0;

    const activeSessions = await this.gameService.getSessions(mode);
    const latestSession = activeSessions[0];
    const latestSessionId = Number(latestSession.roundId);

    if (latestDbSessionId === latestSessionId) {
      throw new ConflictException('Round already started');
    }

    const secretWords = await this.wordsService.generateWords();

    const pk = keccak256(Buffer.from(secretWords, 'utf-8'));
    const { address: targetAddress } = privateKeyToAccount(pk);

    const signature = await this.signaturesService.signGameStart(
      latestSessionId,
      targetAddress,
    );

    const contractAddress = this.gameService.getContractAddressByMode(mode);

    const newRound = await this.prismaService.round.create({
      data: {
        roundId: latestSessionId,
        contract: contractAddress,
        words: secretWords,
      },
    });

    return { roundId: newRound.roundId, signature, targetAddress };
  }

  async getGuessingHistory(roundId: number, userWallet: string) {
    const targetRound = await this.prismaService.round.findFirst({
      where: { roundId },
    });
    if (!targetRound) throw new BadRequestException('Round is not active');

    const history = await this.prismaService.userRoundGuess.findMany({
      where: {
        userRoundRoundId: targetRound.id,
        userRoundUserWallet: userWallet.toLowerCase(),
      },
    });

    return history;
  }

  async tryGuess(
    roundId: number,
    userWallet: string,
    prompt: string,
  ): Promise<GuessResponse> {
    const targetRound = await this.prismaService.round.findFirst({
      where: { roundId },
    });
    if (!targetRound) throw new BadRequestException('Round is not active');

    const contract = targetRound.contract;
    const chainAddresses = contractAddresses[this.chainId];
    const modeKey = Object.entries(chainAddresses).find(
      ([, address]) => address === contract,
    )?.[0];

    if (!modeKey) {
      throw new Error('Contract address does not match any known game mode');
    }
    const mode = modeKey as GameMode;

    const activeSessions = await this.gameService.getSessions(mode);
    const latestSession = activeSessions[0];

    const latestSessionId = Number(latestSession.roundId);
    const targetDbSessionId = targetRound.roundId ?? 0;

    if (latestSessionId !== targetDbSessionId) {
      throw new BadRequestException('Invalid or inactive round');
    }

    const userRound = await this.prismaService.userRound.findUnique({
      where: {
        userWallet_roundId: {
          userWallet: userWallet.toLowerCase(),
          roundId: targetRound.id,
        },
      },
    });
    if (!userRound) {
      throw new BadRequestException('User is not participating in this round');
    }

    const attemptsUsed = userRound.attemptsUsed;
    const attemptsBought = userRound.attemptsBought;
    if (attemptsBought - attemptsUsed <= 0) {
      throw new BadRequestException('No attempts left');
    }

    await this.prismaService.userRound.update({
      where: {
        userWallet_roundId: {
          userWallet: userWallet.toLowerCase(),
          roundId: targetRound.id,
        },
      },
      data: {
        attemptsUsed: { increment: 1 },
      },
    });

    if (!targetRound.words) {
      throw new BadRequestException('Secret words are missing for round');
    }

    const secretWords = targetRound.words.split(' ');
    const response = await this.aiService.getTemperatureForPrompt(
      prompt,
      secretWords,
    );

    await this.prismaService.userRoundGuess.create({
      data: {
        userPromt: prompt,
        temperature: response.temperature,
        guessesWord: response.guessedWord,
        userRoundUserWallet: userWallet.toLowerCase(),
        userRoundRoundId: targetRound.id,
      },
    });

    let wordIndex: number | undefined = undefined;

    if (response.guessedWord) {
      wordIndex = secretWords.indexOf(response.guessedWord);
    }

    return {
      word: response.guessedWord ?? null,
      wordIndex,
      temperature: response.temperature,
    };
  }
}
