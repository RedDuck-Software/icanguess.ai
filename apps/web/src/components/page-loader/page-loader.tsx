import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

interface Props {
  screen?: boolean;
}

export const PageLoader = ({ screen }: Props) => {
  return (
    <div
      className={cn(
        'flex w-full flex-1 items-center justify-center',
        screen ? 'h-screen' : 'h-full',
      )}
    >
      <div className="relative flex items-center">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.7, repeat: Infinity }}
          className="absolute left-2 size-6 rounded-full bg-current"
        ></motion.span>
        <motion.span
          initial={{ x: 0 }}
          animate={{ x: 24 }}
          transition={{ duration: 0.7, repeat: Infinity }}
          className="absolute left-2 size-6 rounded-full bg-current"
        ></motion.span>
        <motion.span
          initial={{ x: 0 }}
          animate={{ x: 24 }}
          transition={{ duration: 0.7, repeat: Infinity }}
          className="absolute left-12 size-6 rounded-full bg-current"
        ></motion.span>
        <motion.span
          initial={{ scale: 1 }}
          animate={{ scale: 0 }}
          transition={{ duration: 0.7, repeat: Infinity }}
          className="absolute left-[88px] size-6 rounded-full bg-current"
        ></motion.span>
      </div>
    </div>
  );
};
