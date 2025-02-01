import { useInView, motion } from 'framer-motion';
import { useRef } from 'react';
import { NavLink } from 'react-router-dom';

import { routes } from '@/router';

export const JoinGame = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <NavLink to={routes.game} ref={ref}>
      <motion.button
        initial={{ x: -500, opacity: 0 }}
        animate={isInView ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 1, delay: 2.4 }}
        className="flex items-center gap-5"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-dark">
          <img
            src="/icons/arrow-down.svg"
            alt="arrow"
            className="h-8 w-8 rotate-[225deg]"
          />
        </div>
        <p className="font-space text-[30px] uppercase text-dark">
          join session
        </p>
      </motion.button>
    </NavLink>
  );
};
