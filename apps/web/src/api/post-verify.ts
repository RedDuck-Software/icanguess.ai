import { publicClient } from '@/lib/httpClient.ts';

const VERIFY_URL = '/auth/verify';

export const postVerify = async (
  message: string,
  signature: string,
  wallet: string,
) => {
  return publicClient.post(VERIFY_URL, {
    message,
    signature,
    wallet,
  });
};
