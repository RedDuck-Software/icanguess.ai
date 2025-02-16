import { useMemo } from 'react';
import { Button } from './ui/button';
import { DialogContent, DialogTitle } from './ui/Dialog';
import { useAppKit } from '@reown/appkit/react';
import { useAccount } from 'wagmi';
import { shortenAddress } from '@/lib/utils';

type Props = {};

export const SelectChainModal = (props: Props) => {
  const { address } = useAccount();
  const chains = useMemo(() => {
    return [
      {
        icon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
        name: 'Ethereum',
        address: address,
      },
      {
        icon: 'https://images.seeklogo.com/logo-png/39/2/near-protocol-near-logo-png_seeklogo-398316.png',
        name: 'NEAR',
        address: address,
      },
    ];
  }, []);
  return (
    <DialogContent>
      <DialogTitle className="mb-2 text-center text-white">
        Select chain
      </DialogTitle>
      <div className="flex flex-col gap-4">
        {chains.map((chain) => (
          <ChainItem key={chain.name} {...chain} />
        ))}
      </div>
    </DialogContent>
  );
};

interface ChainItemProps {
  icon: React.ReactNode | string;
  name: string;
  address?: string;
}

const ChainItem = ({ icon, name, address }: ChainItemProps) => {
  const { open } = useAppKit();

  return (
    <Button
      className="flex items-center justify-between"
      onClick={() => open()}
    >
      <div className="flex items-center gap-2">
        {typeof icon === 'string' ? (
          <img src={icon} alt={name} className="h-8 w-8" />
        ) : (
          icon
        )}
        <p>{address ? shortenAddress(address) : name}</p>
      </div>
    </Button>
  );
};
