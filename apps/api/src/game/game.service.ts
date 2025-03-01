import { Inject, Injectable } from '@nestjs/common';
import { GraphqlService } from 'src/graphql/graphql.service';
import { Address, getAddress } from 'viem';
import { GET_ROUNDS, GetRoundsResponse } from './game.queues';
import { auroraTestnet, sepolia } from 'viem/chains';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/database/prisma.service';

export const INDEXER_URL = 'INDEXER_URL';

export enum GameMode {
  EASY = 'easy',
  HARD = 'hard',
}

export const contractAddresses: Record<number, Record<GameMode, Address>> = {
  [sepolia.id]: {
    [GameMode.EASY]: getAddress('0xD46D8f9e1B03bC0BFDa065A1797d45c64d66902c'),
    [GameMode.HARD]: getAddress('0xD46D8f9e1B03bC0BFDa065A1797d45c64d66902c'), // FIXME:
  },
  [auroraTestnet.id]: {
    [GameMode.EASY]: getAddress('0x2f755809cFC4a83bc15E287f99426Fc6F8716c28'),
    [GameMode.HARD]: getAddress('0x2f755809cFC4a83bc15E287f99426Fc6F8716c28'), // FIXME:
  },
};

@Injectable()
export class GameService {
  private readonly chainId: number;

  constructor(
    @Inject(INDEXER_URL)
    private readonly indexerUrl: string,
    private readonly gqlService: GraphqlService,
    private readonly configService: ConfigService,
    private readonly db: PrismaService,
  ) {
    this.chainId = Number(
      this.configService.get<string>('CHAIN_ID') || sepolia.id,
    );
  }

  async getUserAttempts(user: Address, roundId: number, mode: GameMode) {
    const contract = this.getContractAddressByMode(mode);
    const dbUser = await this.db.userRound.findFirst({
      where: {
        round: { contract, roundId },
        userWallet: user.toLowerCase(),
      },
    });

    return {
      attemptsBought: dbUser?.attemptsBought ?? 0,
      attemptsUser: dbUser?.attemptsUsed ?? 0,
    };
  }

  async getSessions(mode: GameMode) {
    return await this._getGameSessions(this.getContractAddressByMode(mode));
  }

  private async _getGameSessions(contract: Address) {
    const res = await this.gqlService.getQueryResult<GetRoundsResponse>(
      this.indexerUrl,
      GET_ROUNDS,
      {
        contract,
      },
    );

    const currentTs = Math.floor(new Date().getTime() / 1000);

    const [lastRound, prevRound] = res.rounds.items;

    const roundDur = BigInt(res.guessInstance.roundDuration);

    const { currentRoundId, roundEnd, roundStart, roundStartBufferEnd } =
      this.getCurrentRoundInfo(
        BigInt(currentTs),
        BigInt(res.guessInstance.roundDuration),
        BigInt(res.guessInstance.roundStartBuffer),
      );

    return [
      {
        rewardsPool:
          BigInt(lastRound?.totalDeposited ?? '0') +
          BigInt(prevRound?.claimed ? '0' : (prevRound?.totalDeposited ?? '0')),
        participants: +(lastRound?.participants ?? '0'),
        roundId: currentRoundId,
        roundStartTs: roundStart,
        roundEndTs: roundEnd,
      },
      {
        rewardsPool: 0n,
        participants: 0,
        roundId: currentRoundId + 1n,
        roundStartTs: roundEnd,
        roundEndTs: roundDur + roundEnd,
      },
      {
        rewardsPool: 0n,
        participants: 0,
        roundId: currentRoundId + 2n,
        roundStartTs: roundDur + roundEnd,
        roundEndTs: roundDur * 2n + roundEnd,
      },
    ];
  }

  getCurrentRoundInfo = (
    timestamp: bigint,
    roundDuration: bigint,
    roundStartBuffer: bigint,
  ) => {
    const currentRoundId = timestamp / roundDuration;
    const roundStart = currentRoundId * roundDuration;
    const roundEnd = roundStart + roundDuration;
    const roundStartBufferEnd = roundStart + roundStartBuffer;

    return { currentRoundId, roundStart, roundEnd, roundStartBufferEnd };
  };

  getContractAddressByMode(mode: GameMode) {
    return contractAddresses[this.chainId][mode];
  }
}
