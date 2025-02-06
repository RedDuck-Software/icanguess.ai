import { gql } from '@apollo/client';

export type GetRoundsResponse = {
  guessInstance: {
    contract: string;
    guessPassAmount: string;
    roundDuration: string;
    roundStartBuffer: string;
    platformFee: string;
    platformFeeReceiver: string;
    depositPrice: string;
  };
  rounds: {
    items: {
      roundId: string;
      roundEndTs: string;
      roundStartTs: string;
      roundStartBufferEndTs: string;
      totalDeposited: string;
      claimed: boolean;
      participants: string;
      guessInstance: {
        contract: string;
        guessPassAmount: string;
        roundDuration: string;
        roundStartBuffer: string;
        platformFee: string;
        platformFeeReceiver: string;
        depositPrice: string;
      };
    }[];
  };
};
export const GET_ROUNDS = gql`
  query GetRounds(
    $contract: String!
    $networkIdFloat: Float!
    $networkIdInt: Int!
  ) {
    guessInstance(contract: $contract, networkId: $networkIdFloat) {
      contract
      guessPassAmount
      roundDuration
      roundStartBuffer
      platformFee
      platformFeeReceiver
      depositPrice
    }
    rounds(
      orderBy: "roundId"
      limit: 2
      orderDirection: "desc"
      where: { contract: $contract, networkId: $networkIdInt }
    ) {
      items {
        roundId
        roundEndTs
        roundStartTs
        roundStartBufferEndTs
        totalDeposited
        claimed
        participants
        guessInstance {
          contract
          guessPassAmount
          roundDuration
          roundStartBuffer
          platformFee
          platformFeeReceiver
          depositPrice
        }
      }
    }
  }
`;
