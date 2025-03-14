/* eslint-disable no-inline-styles/no-inline-styles */
import { useInView, motion } from 'framer-motion';
import { forwardRef, useRef } from 'react';

import { Card } from '../ui/card';

import { cn } from '@/lib/utils';

const words = [
  'access',
  'tornado',
  'cleaner',
  'mixture',
  'black',
  'house',
  'nature',
  'feel',
  'connection',
  'views',
  'plate',
  'satisfy',
];
const numbers = Array.from({ length: 12 }, (_, i) => i);

export const About = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <section className="relative h-[98vh] w-full">
      <div
        className="absolute -left-[90px] top-24 z-[3] h-[200vh] w-screen rounded-b-[50px] bg-dark"
        style={{
          backgroundImage: "url('/Noise.png')",
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
        }}
      ></div>
      <Card
        className="h-full w-full flex-col overflow-hidden"
        variant={'dark'}
        radius={50}
        darkNoise
      >
        <div
          style={{
            backgroundImage: "url('/Noise.png')",
            backgroundRepeat: 'repeat',
            backgroundSize: 'auto',
          }}
          className="relative z-30 flex w-full bg-dark p-10"
        >
          <div className="flex flex-1 items-center justify-center gap-5">
            <p className="font-space text-[24px] uppercase text-white">
              about project
            </p>
            <img src="/icons/arrow-down-white.svg" alt="arrow" />
          </div>
        </div>
        <div ref={ref} className="flex h-full w-full">
          <div
            style={{
              backgroundImage: "url('/Noise.png')",
              backgroundRepeat: 'repeat',
              backgroundSize: 'auto',
            }}
            className="relative z-30 flex h-full flex-1 flex-col items-center justify-center gap-20 bg-dark px-20"
          >
            <div className="flex flex-col gap-10">
              <h2 className="font-space text-[80px] text-white">
                About Project
              </h2>
              <p className="text-center font-roboto text-[20px] uppercase text-white">
                guess the Seed phrase
              </p>
              <div className="flex w-[670px] flex-wrap justify-center gap-2.5">
                {numbers.map((num) => (
                  <TypingEffect key={num} num={num} text={words[num]} />
                ))}
              </div>
            </div>
          </div>

          <div className="relative z-30 flex h-full flex-1 flex-col items-center justify-center gap-20 px-20">
            <p className="font-roboto text-[20px] text-white">
              <span className="text-[22px] font-bold">
                Dive into a game of intuition and deduction!
              </span>
              <br /> AICANGUESS.AI is an AI-powered GameFi platform where anyone
              can participate in guessing mnemonic phrase words and claim the
              grand prize — the entire reward pool. Players can choose between
              two difficulty levels: easy and hard, and start with either one.
              Our AI agent will guide you toward victory. Compete against other
              players, invite friends, and have fun!
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
});

export function TypingEffect({ text, num }: { text: string; num: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  return (
    <div
      ref={ref}
      className={cn(
        'flex w-[200px] gap-1 rounded-[6px] bg-dark px-5 py-4 font-roboto text-[20px]',
        num === 4 || num === 9 ? 'mr-20' : '',
      )}
    >
      <p className="text-white/50">{num < 9 ? '0' + (num + 1) : num + 1}.</p>
      <p className="text-white">
        {text.split('').map((letter, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1 * Math.random(), delay: index * 0.3 }}
          >
            {letter}
          </motion.span>
        ))}
      </p>
    </div>
  );
}
