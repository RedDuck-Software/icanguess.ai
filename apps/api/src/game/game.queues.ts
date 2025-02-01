import { gql } from '@apollo/client';

export type GetRoundsResponse = {
  rounds: {
    items: {
      roundId: string;
      roundEndTs: string;
      roundStartTs: string;
      roundStartBufferEndTs: string;
      totalDeposited: string;
      claimed: boolean;
    }[];
  };
};
export const GET_ROUNDS = gql`
  query GetRounds($contract: String) {
    rounds(
      orderBy: "roundId"
      limit: 2
      orderDirection: "desc"
      where: { contract: $contract }
    ) {
      items {
        roundId
        roundEndTs
        roundStartTs
        roundStartBufferEndTs
        totalDeposited
        claimed
      }
    }
  }
`;
