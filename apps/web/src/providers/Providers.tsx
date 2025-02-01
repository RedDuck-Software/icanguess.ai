import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { FC, PropsWithChildren } from 'react';

import { WagmiProvider } from './wagmi-provider';

const queryClient = new QueryClient();

const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider>{children}</WagmiProvider>
    </QueryClientProvider>
  );
};

export default Providers;
