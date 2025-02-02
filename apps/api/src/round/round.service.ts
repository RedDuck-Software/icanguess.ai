import { ConflictException, Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { WordsService } from '../words/words.service';
import { PrismaService } from '../database/prisma.service';
import { SignaturesService } from '../signatures/signatures.service';
import { GameMode, GameService } from '../game/game.service';
import { Address, Chain, keccak256 } from 'viem';
import { arbitrum, mainnet, sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

// type GuessResponse = {
//   word: string | null;
//   temperature: number;
// };

@Injectable()
export class RoundService {
  constructor(
    private readonly aiService: AiService,
    private readonly prismaService: PrismaService,
    private readonly wordsService: WordsService,
    private readonly signaturesService: SignaturesService,
    private readonly gameService: GameService,
  ) {}

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

  // async tryGuess(roundId: number, prompt: string): Promise<GuessResponse> {
  //   // check round is active
  //
  //   // check rompt validity (lenght, etc.)
  //
  //   // no spec symbols
  //
  //   // save history to
  //
  //   const secretWords = this.wordsService.getWordsForRound(roundId);
  //   const response = this.aiService.getTemperatureForPrompt(prompt);
  //
  //   return { word: null, temperature: 30 };
  // }

  private getChainConfig(chainId: number) {
    const chainMapping: Record<number, Chain> = {
      [mainnet.id]: mainnet,
      [arbitrum.id]: arbitrum,
      [sepolia.id]: sepolia,
    };

    return chainMapping[chainId] || mainnet;
  }
}
