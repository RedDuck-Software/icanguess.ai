import { useQuery } from '@tanstack/react-query';

import { publicClient } from '@/lib/httpClient';
export interface Session {
  rewardsPool: number;
  participants: number;
  roundId: number;
  roundStartTs: number;
  roundEndTs: number;
}
export const useSessions = () => {
  return useQuery({
    queryKey: ['sessions'],
    refetchInterval: 5 * 1000,
    queryFn: async () => {
      return await publicClient.get<{ sessions: Session[] }>(
        '/game/sessions?mode=easy',
      );
    },
  });
};
