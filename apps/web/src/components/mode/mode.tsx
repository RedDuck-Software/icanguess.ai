import { forwardRef } from 'react';

import { Card } from '../ui/card';

export const Mode = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <section className="h-[98vh] w-full">
      <Card
        className="h-full w-full flex-col overflow-hidden"
        variant={'light-gray'}
        radius={50}
      >
        <div className="flex w-full bg-purple p-10">
          <div className="flex flex-1 items-center justify-center gap-5">
            <p className="font-space text-[24px] uppercase text-dark">
              Change mode
            </p>
            <img src="/icons/arrow-down.svg" alt="arrow" />
          </div>
          <div className="flex flex-1 items-center justify-center gap-5">
            <p className="font-space text-[24px] uppercase text-dark">Rules</p>
            <img src="/icons/arrow-down.svg" alt="arrow" />
          </div>
        </div>
        <div ref={ref} className="flex h-full w-full">
          <div className="relative flex h-full flex-1 flex-col items-center justify-center gap-20 bg-purple px-20">
            <img
              src="/icons/blocks.svg"
              alt="blocks"
              className="absolute bottom-8 right-8"
            />
            <div className="flex flex-col">
              <h2 className="font-space text-[110px] text-dark">Easy Mode</h2>
              <p className="font-roboto text-[20px]">
                An easier version of the game. You will need to guess 3 words of
                the seed phrase.
              </p>
            </div>
            <div className="w-full">
              <button className="flex items-center gap-5">
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
              </button>
            </div>
          </div>

          <div className="flex h-full flex-1 flex-col items-center justify-center gap-20 px-20">
            <div className="flex flex-col">
              <h2 className="font-space text-[110px] text-dark">Hard Mode</h2>
              <p className="font-roboto text-[20px]">
                Hard version of the game. You will need to guess 12 words of the
                seed phrase.
              </p>
            </div>
            <div className="w-full">
              <button className="flex items-center gap-5">
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
              </button>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
});
