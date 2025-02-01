import { useAppKit } from '@reown/appkit/react';
import { useInView, motion } from 'framer-motion';
import { useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAccount } from 'wagmi';

import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

import { routes } from '@/router';
import { shortenAddress } from '@/lib/utils';
import { useDisconnect } from '@reown/appkit/react';

export const Header = () => {
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const location = useLocation();
  const isLanding = location.pathname === routes.root;
  return (
    <div ref={ref} className="px-[90px]">
      <motion.div
        initial={{ y: isLanding ? -500 : 0 }}
        animate={isInView && isLanding ? { y: 0 } : {}}
        transition={{ duration: 1, delay: 2.3 }}
      >
        <Card
          variant={'dark'}
          radius={8}
          className="items-center justify-between px-5 py-6"
        >
          <NavLink to={routes.root} className="font-space text-2xl text-white">
            icanguess.ai
          </NavLink>
          {address ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className="w-[200px]"
                  onClick={() => open()}
                  size={'sm'}
                >
                  {shortenAddress(address)}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                onClick={disconnect}
                className="h-[46px] w-[200px] border border-white bg-transparent px-6 py-2.5 text-center text-white hover:opacity-80"
              >
                Disconnect
              </PopoverContent>
            </Popover>
          ) : (
            <Button className="w-[200px]" onClick={() => open()} size={'sm'}>
              Connect Wallet
            </Button>
          )}
        </Card>
      </motion.div>
    </div>
  );
};
