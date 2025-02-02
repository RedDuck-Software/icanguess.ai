import { useMutation } from '@tanstack/react-query';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';

import { publicClient } from '../../lib/httpClient';

interface Data {
  roundId: number;
  prompt: string;
}

export const useTakeGuess = () => {
  const { address } = useAccount();
  return useMutation({
    async mutationFn(data: Data) {
      if (!address) return;

      const body = {
        prompt: data.prompt,
        walletAddress: address,
      };

      return await publicClient.post<{
        word: string | null;
        wordIndex: number | null;
        temperature: number;
      }>(`/rounds/${data.roundId}/guess`, body);
    },
  });
};
