import { useMutation } from '@tanstack/react-query';
import type { Address } from 'viem';

import { publicClient } from '../../lib/httpClient';

export const useStartRound = () => {
  return useMutation({
    async mutationFn() {
      return await publicClient.post<{
        roundId: number;
        signature: Address;
        targetAddress: Address;
      }>('/rounds/start', { mode: 'easy' });
    },
  });
};
