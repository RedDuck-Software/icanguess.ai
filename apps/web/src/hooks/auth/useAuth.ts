import { useMutation } from '@tanstack/react-query';
import { SiweMessage } from 'siwe';
import { useAccount, useSignMessage } from 'wagmi';

import { getNonce } from '@/api/get-nonce.ts';
import { publicClient } from '@/lib/httpClient.ts';

export const useBackendAuth = () => {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  return useMutation<string, Error>({
    mutationFn: async () => {
      if (!address) {
        throw new Error(
          'Wallet not connected. Please connect your wallet first.',
        );
      }

      const nonce = await getNonce(address);
      if (!nonce) {
        throw new Error('No nonce returned from the server.');
      }

      const domain = window.location.host;
      const origin = window.location.origin;
      const statement = 'Sign in with Ethereum to our app.';
      const siweMessage = new SiweMessage({
        domain,
        address,
        statement,
        uri: origin,
        version: '1',
        chainId: 1,
        nonce,
      });
      const messageToSign = siweMessage.prepareMessage();

      const signature = await signMessageAsync({ message: messageToSign });

      const verifyResponse = await publicClient.post('/auth/verify', {
        message: messageToSign,
        signature,
        address,
      });
      const { token } = verifyResponse.data;
      if (!token) {
        throw new Error('No token returned after verification.');
      }

      localStorage.setItem('token', token);
      return token;
    },
    onSuccess: (token) => {
      console.log('Logged in successfully, token:', token);
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};
