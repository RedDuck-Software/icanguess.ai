/* eslint-disable no-inline-styles/no-inline-styles */
import { forwardRef } from 'react';

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
              <div className="flex flex-wrap justify-center gap-2.5">
                {numbers.map((num) => (
                  <div
                    key={num}
                    className={cn(
                      'flex w-[200px] gap-1 rounded-[6px] bg-dark px-5 py-4 font-roboto text-[20px]',
                      num === 4 || num === 9 ? 'mr-20' : '',
                    )}
                  >
                    <p className="text-white/50">
                      {num < 10 ? '0' + (num + 1) : num + 1}.
                    </p>
                    <p className="text-white">{words[num]}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative z-30 flex h-full flex-1 flex-col items-center justify-center gap-20 px-20">
            <p className="font-roboto text-[20px] text-white">
              Lorem ipsum dolor sit amet consectetur. Sed turpis id elit laoreet
              leo facilisi ac. Eros sem sit enim a vestibulum adipiscing
              consequat. Amet diam velit fames non orci nullam. Nascetur nunc
              laoreet eget malesuada porttitor elit etiam. Risus facilisis
              habitant lectus tortor mauris. Tortor consectetur etiam felis
              duis. Nisl fermentum feugiat suspendisse aliquam. Sit nunc sed
              pellentesque ut est pretium. Lectus quis vel nulla magna bibendum.
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
});
