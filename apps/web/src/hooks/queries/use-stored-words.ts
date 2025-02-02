import { useQuery } from '@tanstack/react-query';

export const useStoredWords = () => {
  return useQuery({
    queryKey: ['stored-words'],
    refetchInterval: 200,
    queryFn: async () => {
      return localStorage.getItem('words');
    },
  });
};
