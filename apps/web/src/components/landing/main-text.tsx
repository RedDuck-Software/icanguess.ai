import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
const text = 'icanguess.ai - a game that uses AI to guess the seed phrase';

export const MainText = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <h1 ref={ref} className="mb-[26vh] font-space text-[80px] text-dark">
      {text.split('').map((letter, index) => (
        <motion.span
          key={index}
          className="font-space uppercase"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.1, delay: index * 0.04 }}
        >
          {letter}
        </motion.span>
      ))}
    </h1>
  );
};
