import { useQuery } from '@tanstack/react-query';

import { privateClient, publicClient } from '@/lib/httpClient';
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
      const res = await fetch(
        'https://1d6c-5-181-248-159.ngrok-free.app/api/game/sessions?mode=easy',
        { headers: { 'ngrok-skip-browser-warning': 'true' } },
      );
      return await res.json();
      return await publicClient.get<{ sessions: Session[] }>(
        '/game/sessions?mode=easy',
      );
    },
  });
};
