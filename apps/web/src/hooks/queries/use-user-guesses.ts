import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

import { publicClient } from '@/lib/httpClient';
export interface Session {
  rewardsPool: number;
  participants: number;
  roundId: number;
  roundStartTs: number;
  roundEndTs: number;
}
export const useUserGuesses = (roundId?: number) => {
  const { address } = useAccount();
  return useQuery({
    queryKey: ['user-guesses', address, roundId],
    enabled: !!roundId && !!address,
    queryFn: async () => {
      return await publicClient.get<{
        attemptsBought: number;
        attemptsUser: number;
      }>(`/game/users/attempts?mode=easy&roundId=${roundId}`);
    },
  });
};
