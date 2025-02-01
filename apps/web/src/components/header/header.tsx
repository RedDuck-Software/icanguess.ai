import { useAppKit } from '@reown/appkit/react';
import { useInView, motion } from 'framer-motion';
import { useRef } from 'react';
import { useAccount } from 'wagmi';

import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

export const Header = () => {
  const { open } = useAppKit();
  const { address } = useAccount();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="px-[90px] pt-10">
      <motion.div
        initial={{ y: -500 }}
        animate={isInView ? { y: 0 } : {}}
        transition={{ duration: 1, delay: 2.3 }}
      >
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
      </motion.div>
    </div>
  );
};
