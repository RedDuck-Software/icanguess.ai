import { useQuery } from '@tanstack/react-query';

import { get } from '../utils';

import { apiClient } from '@/lib/fetcher';

export const useTest = () => {
  return useQuery<string>({
    queryKey: ['test'],
    queryFn: async () => {
      const client = apiClient();
      return await get<string>(client, '/test');
    },
  });
};
