import { useQuery } from '@tanstack/react-query';

import { publicClient } from '@/lib/httpClient';
import { GameMode } from '@/common';
export interface Session {
  rewardsPool: number;
  participants: number;
  roundId: number;
  roundStartTs: number;
  roundEndTs: number;
}

export const useSessions = (chainId: number, mode: GameMode) => {
  return useQuery({
    queryKey: ['sessions', mode, chainId],
    refetchInterval: 5 * 1000,
    queryFn: async () => {
      return await publicClient.get<{ sessions: Session[] }>(
        `/game/sessions?mode=${mode}&chainId=${chainId}`,
      );
    },
  });
};
