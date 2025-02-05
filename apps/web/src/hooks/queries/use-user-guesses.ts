import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

import { privateClient } from '@/lib/httpClient';
export interface Session {
  rewardsPool: number;
  participants: number;
  roundId: number;
  roundStartTs: number;
  roundEndTs: number;
}

export const useUserGuesses = (chainId: number, roundId?: number) => {
  const { address } = useAccount();
  return useQuery({
    queryKey: ['user-guesses', address, roundId, chainId],
    enabled: !!roundId && !!address,
    refetchInterval: 5 * 1000,
    queryFn: async () => {
      return await privateClient.get<{
        attempts: {
          attemptsBought: number;
          attemptsUser: number;
        };
      }>(
        `/game/users/attempts?mode=easy&roundId=${roundId}&chainId=${chainId}`,
      );
    },
  });
};
