import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

import { privateClient } from '../../lib/httpClient';

interface Data {
  roundId: number;
  prompt: string;
}

export const useTakeGuess = () => {
  const { address } = useAccount();
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: Data) {
      if (!address) return;

      const body = {
        prompt: data.prompt,
        walletAddress: address,
      };

      return await privateClient.post<{
        word: string | null;
        wordIndex: number | null;
        temperature: number;
      }>(`/rounds/${data.roundId}/guess`, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-guesses', 'sessions'] });
    },
  });
};
