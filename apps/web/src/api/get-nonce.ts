import { publicClient } from '@/lib/httpClient.ts';

const NONCE_URL = '/auth/nonce';

export const getNonce = async (wallet?: string): Promise<string> => {
  const { data } = await publicClient.post(NONCE_URL, { wallet });
  console.log('data ==>', data);

  return data;
};
