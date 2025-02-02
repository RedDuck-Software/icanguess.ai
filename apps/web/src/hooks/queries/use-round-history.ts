import { useQuery } from '@tanstack/react-query';

import { publicClient } from '@/lib/httpClient';

export interface History {
  id: string;
  temperature: number;
  userPromt: string;
  guessesWord: string | null;
  userRoundUserWallet: string;
  userRoundRoundId: string;
}
export const useRoundHistory = (roundId: number) => {
  return useQuery({
    queryKey: ['round-history'],
    refetchInterval: 5 * 1000,
    queryFn: async () => {
      return await publicClient.get<{ history: History[] }>(
        `/rounds/${roundId}/guess/history`,
      );
    },
  });
};
