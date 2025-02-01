import {
  type SIWESession,
  type SIWEVerifyMessageArgs,
  type SIWECreateMessageArgs,
  createSIWEConfig,
  formatMessage,
} from '@reown/appkit-siwe';
import { SiweMessage } from 'siwe';

const BASE_URL = 'http://localhost:8080';

/* Function that returns the user's session - this should come from your SIWE backend */
async function getSession() {
  const res = await fetch(BASE_URL + '/session', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await res.json();

  const isValidData =
    typeof data === 'object' &&
    typeof data.address === 'string' &&
    typeof data.chainId === 'number';

  return isValidData ? (data as SIWESession) : null;
}

/* Use your SIWE server to verify if the message and the signature are valid */
const verifyMessage = async ({ message, signature }: SIWEVerifyMessageArgs) => {
  try {
    const response = await fetch(BASE_URL + '/verify', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({ message, signature }),
      credentials: 'include',
    });

    if (!response.ok) {
      return false;
    }

    const result = await response.json();
    return result === true;
  } catch (error) {
    return false;
  }
};

// The verifySignature is not working with social logins and emails with non deployed smart accounts
// for this reason we recommend using the viem to verify the signature
// import { verifySignature } from '@reown/appkit-siwe'
// const isValid = await verifySignature({ address, message, signature, chainId, projectId })

// Check the full example for signOut and getNonce functions ...

/* Create a SIWE configuration object */
export const siweConfig = createSIWEConfig({
  getMessageParams: async () => ({
    domain: window.location.host,
    uri: window.location.origin,
    chains: [1, 2020],
    statement: 'Please sign with your account',
  }),
  createMessage: ({ address, ...args }: SIWECreateMessageArgs) =>
    formatMessage(args, address),

  getNonce: async () => {
    //This is only an example, substitute it with your actual nonce getter.
    const nonce = 'YOUR_NONCE_GETTER';
    if (!nonce) {
      throw new Error('Failed to get nonce!');
    }
    return nonce;
  },
  getSession,
  verifyMessage,
  signOut: async () => {
    return true;
    //Example
    // Implement your Sign out function
  },
});
