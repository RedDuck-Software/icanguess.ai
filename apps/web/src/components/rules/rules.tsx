import { forwardRef } from 'react';

import { Card } from '../ui/card';
const rules = [
  'The game starts automatically based on a timer.There is no minimum or maximum number of participants required to start the game.',
  'Enter words between 3 to 20 characters long that can bring you closer to victory for a better user experience. The AI will guide you by indicating how close you are to the correct word. Words cannot contain hyphens and spaces.',
  'The prize pool is formed from the contributions of all participants in the game session, minus a 10% administrator fee.',
  'The first player to guess all the target words (depending on the mode) and claim the prize before time runs out wins.',
  'To participate in a single game session, a user must pay 0.0015 ETH for 50 attempts (~$5). Additional sets of 50 attempts can be purchased at the same price within the same session.',
  'Each game session lasts 1 hour, regardless of whether the words are guessed or not. If no one guesses the words and the 24-hour cycle ends, all funds roll over into a new session with a new address, where the reward remains the same but the words change completely',
];

export const Rules = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <section className="relative z-30 h-[98vh] w-full">
      <Card
        className="h-full w-full flex-col gap-10 p-10"
        variant={'light-gray'}
        radius={50}
        lightNoise
      >
        <div className="flex items-center gap-5">
          <p className="font-space text-[24px] uppercase text-dark">Rules</p>
          <img src="/icons/arrow-down.svg" alt="arrow" />
        </div>
        <div ref={ref} className="flex h-full w-full px-5">
          <div className="flex h-full flex-1 flex-col items-center justify-center gap-5">
            <h2 className="font-space text-[80px] text-dark">Rules</h2>
            <div>
              {rules.map((rule, i) => (
                <p className="font-roboto text-[17px] text-dark" key={rule}>
                  {i + 1}. {rule}
                </p>
              ))}
            </div>
          </div>
          <div className="flex h-full w-full flex-1 flex-col items-center justify-between px-5 py-20">
            <img src="/icons/eth.svg" alt="eth" className="max-w-[208px]" />
            <img src="/icons/elipse.svg" alt="eth" className="max-w-[218px]" />
          </div>
        </div>
      </Card>
    </section>
  );
});
