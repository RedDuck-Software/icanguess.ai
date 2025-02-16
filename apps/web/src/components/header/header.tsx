import { useAppKitState } from '@reown/appkit/react';
import { useDisconnect } from '@reown/appkit/react';
import { useInView, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAccount } from 'wagmi';

import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

import { shortenAddress } from '@/lib/utils';
import { routes } from '@/router';
import { Dialog } from '../ui/Dialog';
import { SelectChainModal } from '../select-chain-modal';

export const Header = () => {
  const [selectOpen, setOpen] = useState(false);
  const { disconnect } = useDisconnect();
  const { open } = useAppKitState();
  const { address } = useAccount();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const location = useLocation();
  const isLanding = location.pathname === routes.root;
  return (
    <>
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
            <NavLink
              to={routes.root}
              className="font-space text-2xl text-white"
            >
              icanguess.ai
            </NavLink>
            {address ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="w-[200px]" size={'sm'}>
                    {shortenAddress(address)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  onClick={disconnect}
                  className="relative z-50 h-[46px] w-[200px] cursor-pointer border border-white bg-dark bg-transparent px-6 py-2.5 text-center text-xl text-white hover:opacity-80 [&_div]:bg-dark"
                >
                  Disconnect
                </PopoverContent>
              </Popover>
            ) : (
              <Button
                className="w-[200px]"
                onClick={() => setOpen(true)}
                size={'sm'}
              >
                Connect Wallet
              </Button>
            )}
          </Card>
        </motion.div>
      </div>
      <Dialog
        open={selectOpen}
        onOpenChange={(val) => setOpen(open ? true : val)}
      >
        <SelectChainModal />
      </Dialog>
    </>
  );
};
