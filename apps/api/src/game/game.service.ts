import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { GraphqlService } from 'src/graphql/graphql.service';
import { Address } from 'viem';
import { GET_ROUNDS, GetRoundsResponse } from './game.queues';
export const INDEXER_URL = 'INDEXER_URL' as const;

export type GameMode = 'easy' | 'hard';

@Injectable()
export class GameService {
  constructor(
    @Inject(INDEXER_URL)
    private readonly indexerUrl: string,
    private readonly gqlService: GraphqlService,
  ) {}

  async getSessions(mode: GameMode) {
    return {};
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
