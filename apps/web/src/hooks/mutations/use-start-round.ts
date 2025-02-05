import { useMutation } from '@tanstack/react-query';
import type { Address } from 'viem';

import { privateClient } from '../../lib/httpClient';
import { GameMode } from '@/common';

export const useStartRound = () => {
  return useMutation({
    mutationFn: async ({
      chainId,
      mode,
    }: {
      chainId: number;
      mode: GameMode;
    }) => {
      return await privateClient.post<{
        roundId: number;
        signature: Address;
        targetAddress: Address;
      }>('/round/start', { mode, chainId });
    },
  });
};
