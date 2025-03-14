import { auroraTestnet, Chain } from '@reown/appkit/networks';
import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

import { siweConfig } from './siwe.ts';

// 1. Get projectId from https://cloud.reown.com
const projectId = 'b484687f762048e470638dfc5535647c';

// 2. Create a metadata object - optional
const metadata = {
  name: 'icanguess.ai',
  description: 'icanguess.ai game',
  url: 'https://icanguess.ai', // origin must match your domain & subdomain
  icons: ['https://icanguess-ai.netlify.app/icons/blocks.svg'],
};

// 3. Set the networks
const networks = [auroraTestnet] satisfies [Chain, ...Chain[]];

// 4. Create Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false,
});

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
  siweConfig: siweConfig,
});
