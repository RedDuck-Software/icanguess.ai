import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

import { Card } from '../ui/card';

import { cn } from '@/lib/utils';

interface GuessSeedPhraseProps {
  words: string[]; // Words passed as props
}

const numbers = Array.from({ length: 12 }, (_, i) => i);

export const GuessSeedPhrase = ({ words }: GuessSeedPhraseProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <Card className="w-2/3 flex-col gap-10 p-10" variant={'dark'} radius={20}>
      <p className="text-center font-space text-[30px] uppercase text-white">
        Guess seed phrase
      </p>
      <div ref={ref} className="flex flex-wrap justify-center gap-2.5">
        {numbers.map((num) => (
          <div
            key={num}
            className={cn(
              'flex w-[200px] gap-1 rounded-[6px] border bg-dark-gray px-5 py-4 font-roboto text-[20px]',
              words[num] ? 'border-[#646464]' : 'border-dark-gray',
            )}
          >
            <p className="text-white/50">
              {num < 10 ? '0' + (num + 1) : num + 1}.
            </p>
            <p className="text-white">
              {words[num]?.split('').map((letter, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{
                    duration: 1 * Math.random(),
                    delay: index * 0.3,
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};
