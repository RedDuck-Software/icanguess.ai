import { useAppKit } from '@reown/appkit/react';
import { useAccount } from 'wagmi';

import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

export const Header = () => {
  const { open } = useAppKit();
  const { address } = useAccount();

  return (
    <div className="px-[90px]">
      <Card
        variant={'dark'}
        radius={8}
        className="items-center justify-between px-5 py-6"
      >
        <h1 className="font-space text-2xl text-white">icanguess.ai</h1>
        {address ? (
          <Popover>
            <PopoverTrigger disabled={!address} asChild>
              <Button onClick={() => open()} size={'sm'}>
                Connect Wallet
              </Button>
            </PopoverTrigger>
            <PopoverContent>asddsa</PopoverContent>
          </Popover>
        ) : (
          <Button onClick={() => open()} size={'sm'}>
            Connect Wallet
          </Button>
        )}
      </Card>
    </div>
  );
};
