import { auroraTestnet, mainnet, sepolia } from '@reown/appkit/networks';
import {
  createSIWEConfig,
  formatMessage,
  type SIWECreateMessageArgs,
  type SIWESession,
  type SIWEVerifyMessageArgs,
} from '@reown/appkit-siwe';
import type { Address } from 'viem';

import { getNonce } from '../api/get-nonce.ts';
import { getSession as getSessionApi } from '../api/get-session.ts';

import { postVerify } from '@/api/post-verify.ts';

async function getSession(): Promise<SIWESession | null> {
  try {
    const data = await getSessionApi();
    if (!data) return null;

    if (!data || !data.address) return null;

    return data as SIWESession;
  } catch {
    return null;
  }
}

const verifyMessage = async (args: SIWEVerifyMessageArgs) => {
  try {
    const { message, signature, data } = args as SIWEVerifyMessageArgs & {
      data: { accountAddress: Address };
    };

    const { accountAddress } = data as { accountAddress: Address };
    const response = await postVerify(message, signature, accountAddress);

    if (!response.data) {
      return false;
    }

    localStorage.setItem('token', response.data.token);

    console.log(1);
    return true;
  } catch {
    return false;
  }
};

function createMessage({ address, ...args }: SIWECreateMessageArgs) {
  return formatMessage(args, address);
}

async function signOut() {
  localStorage.removeItem('token');
  return true;
}

export const siweConfig = createSIWEConfig({
  getMessageParams: async () => ({
    domain: window.location.host,
    uri: window.location.origin,
    chains: [sepolia.id, mainnet.id, auroraTestnet.id],
    statement: 'Please sign with your account',
  }),
  createMessage,
  getNonce,
  getSession,
  verifyMessage,
  signOut,
});
