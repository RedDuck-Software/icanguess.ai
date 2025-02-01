import { useMutation } from '@tanstack/react-query';

import { post } from '../utils';

import { apiClient } from '@/lib/fetcher';

export const useUpdateProfile = () => {
  return useMutation({
    async mutationFn() {
      const client = apiClient();
      return await post(client, '/test');
    },
  });
};
