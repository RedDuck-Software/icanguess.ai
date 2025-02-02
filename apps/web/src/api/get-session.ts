import { type SIWESession } from '@reown/appkit-siwe';

import { publicClient } from '@/lib/httpClient.ts';
const SESSION_URL = '/auth/session';

export const getSession = async (): Promise<SIWESession | null> => {
  try {
    publicClient.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) config.headers['Authorization'] = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error),
    );

    const { data } = await publicClient.get<{
      address: string;
      chainId: number;
    }>(SESSION_URL);
    return data;
  } catch {
    return null;
  }
};
