import { useAccount, useChains } from 'wagmi';

export const useQueryChain = () => {
  const { chain } = useAccount();
  const chains = useChains();

  return chain ?? chains[0];
};
