import {
  createSIWEConfig,
  formatMessage,
  type SIWECreateMessageArgs,
  type SIWESession,
  type SIWEVerifyMessageArgs,
} from '@reown/appkit-siwe';
import type { Address } from 'viem';

import { getNonce } from '../api/get-nonce.ts';

import { postVerify } from '@/api/post-verify.ts';

const BASE_URL = 'http://localhost:3000/api';

// 2. getSession
async function getSession(): Promise<SIWESession | null> {
  try {
    const res = await fetch(`${BASE_URL}/auth/session`, {
      method: 'GET',
      credentials: 'include', // if storing JWT in HttpOnly cookie
      // or pass the Bearer token if you store it in localStorage
    });
    if (!res.ok) return null;

    const data = await res.json();
    if (!data || !data.address) return null; // not signed in

    return data as SIWESession; // { address: string; chainId: number }
  } catch {
    return null;
  }
}

// 3. verifyMessage
const verifyMessage = async (args: SIWEVerifyMessageArgs) => {
  try {
    const { message, signature, data } = args;
    const { accountAddress } = data as { accountAddress: Address };

    console.log({ message, signature, accountAddress });
    const response = await postVerify(message, signature, accountAddress);

    console.log('response ==>', response);

    if (!response.data) {
      return false;
    }

    localStorage.setItem('token', response.data);

    // Let Reown know the user is now signed in
    return true;
  } catch {
    return false;
  }
};

// 4. createMessage
function createMessage({ address, ...args }: SIWECreateMessageArgs) {
  return formatMessage(args, address);
}

// 5. signOut
async function signOut() {
  // remove the JWT from localStorage
  localStorage.removeItem('token');
  return true;
}

// 6. The SIWE config
export const siweConfig = createSIWEConfig({
  getMessageParams: async () => ({
    domain: window.location.host,
    uri: window.location.origin,
    chains: [1, 2020],
    statement: 'Please sign with your account',
  }),
  createMessage,
  getNonce,
  getSession,
  verifyMessage,
  signOut,
});
