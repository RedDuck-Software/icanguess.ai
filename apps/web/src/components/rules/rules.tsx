import { forwardRef } from 'react';

import { Card } from '../ui/card';
const rules = [
  'Lorem ipsum dolor sit amet consectetur. At pharetra facilisis magna at orci gravida donec sit turpis. ',
  'Purus congue augue pharetra ornare amet. ',
  'Consequat ullamcorper eget iaculis ac ipsum mattis donec. A at volutpat diam diam gravida sit. ',
  'Quam est congue laoreet dolor iaculis quis. A',
  'met diam lorem at libero lorem cursus faucibus ut.',
];

export const Rules = forwardRef<HTMLDivElement>((props, ref) => {
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
                <p className="font-roboto text-[20px] text-dark" key={rule}>
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
