import { memo, type PropsWithChildren } from 'react';
import { WagmiProvider as WgmiProvider } from 'wagmi';

import { wagmiAdapter } from '@/lib/wagmi-config';

export const WagmiProvider = memo(({ children }: PropsWithChildren) => {
  return (
    <WgmiProvider config={wagmiAdapter.wagmiConfig}>{children}</WgmiProvider>
  );
});
WagmiProvider.displayName = 'WagmiProvider';
