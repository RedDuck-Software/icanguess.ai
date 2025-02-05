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
export const useRoundHistory = (chainId: number, roundId: number) => {
  return useQuery({
    queryKey: ['round-history', roundId, chainId],
    refetchInterval: 1 * 1000,
    queryFn: async () => {
      return await publicClient.get<{ history: History[] }>(
        `/round/guess/history?chainId=${chainId}&roundId=${roundId}`,
      );
    },
  });
};
