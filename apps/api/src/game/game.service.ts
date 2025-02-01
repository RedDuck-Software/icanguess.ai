import { Inject, Injectable } from '@nestjs/common';
import { GraphqlService } from 'src/graphql/graphql.service';
import { Address, getAddress } from 'viem';
import { GET_ROUNDS, GetRoundsResponse } from './game.queues';
import { sepolia } from 'viem/chains';

export const INDEXER_URL = 'INDEXER_URL' as const;

export enum GameMode {
  EASY = 'easy',
  HARD = 'hard',
}

const contractAddresses = {
  [sepolia.id]: {
    ['easy']: getAddress('0x2D445088ddA9dcAcDFc9b8e49C3aAb88c348a6EC'),
    ['hard']: getAddress('0x2D445088ddA9dcAcDFc9b8e49C3aAb88c348a6EC'), // FIXME:
  },
};

@Injectable()
export class GameService {
  constructor(
    @Inject(INDEXER_URL)
    private readonly indexerUrl: string,
    private readonly gqlService: GraphqlService,
  ) {}

  async getSessions(mode: GameMode) {
    return await this._getGameSessions(
      contractAddresses[
        // FIXME: use chain id from .env
        sepolia.id
      ][mode],
    );
  }

  private async _getGameSessions(contract: Address) {
    const res = await this.gqlService.getQueryResult<GetRoundsResponse>(
      this.indexerUrl,
      GET_ROUNDS,
      {
        contract,
      },
    );

    console.log({ res });

    const currentTs = Math.floor(new Date().getTime());

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
        participants: +lastRound.participants,
        roundId: currentRoundId,
        roundStartTs: roundStart,
        roundEndTs: roundEnd,
      },
      {
        rewardsPool: 0n,
        participants: 0,
        roundId: currentRoundId + 1n,
        roundStartTs: roundEnd + 1n,
        roundEndTs: roundDur + roundEnd + 1n,
      },
      {
        rewardsPool: 0n,
        participants: 0,
        roundId: currentRoundId + 1n,
        roundStartTs: roundEnd + 1n,
        roundEndTs: roundDur + roundEnd + 1n,
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
}
