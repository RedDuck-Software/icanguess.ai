import { Card } from '../ui/card';

import { cn } from '@/lib/utils';

const words = ['aboba', 'biba', 'miba', 'jiba'];
const numbers = Array.from({ length: 12 }, (_, i) => i);
export const GuessSeedPhrase = () => {
  return (
    <Card className="w-2/3 flex-col gap-10 p-10" variant={'dark'} radius={20}>
      <p className="text-center font-space text-[30px] uppercase text-white">
        Guess seed phrase
      </p>
      <div className="flex flex-wrap justify-center gap-2.5">
        {numbers.map((num) => (
          <div
            className={cn(
              'flex w-[200px] gap-1 border px-5 py-4 font-roboto text-[20px]',
              words[num] ? 'border-[#646464]' : 'border-dark-gray',
            )}
          >
            <p className="text-white/50">
              {num < 10 ? '0' + (num + 1) : num + 1}.
            </p>
            <p className="text-white">{words[num]}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};
