import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type Props = {};

export const YourAnswer = (props: Props) => {
  return (
    <Card className="w-2/3 flex-col gap-10 p-10" variant={'dark'} radius={20}>
      <div className="flex w-full gap-10">
        <h2 className="font-space text-[30px] uppercase text-white">
          Your Answer result
        </h2>
      </div>
      <div className="relative mb-[24px] h-6 w-full rounded-[20px] bg-gradient-to-r from-[#4F43EE] via-[#9C3283] to-[#E82019]">
        <p className="absolute -bottom-8 left-0 font-roboto text-[16px] text-white/50">
          Very Cold
        </p>
        <p className="absolute -bottom-8 left-1/3 font-roboto text-[16px] text-white/50">
          Cold
        </p>
        <p className="absolute -bottom-8 right-1/3 font-roboto text-[16px] text-white/50">
          Warm
        </p>
        <p className="absolute -bottom-8 right-0 font-roboto text-[16px] text-white/50">
          Hot
        </p>
      </div>
      <Input placeholder="Enter word" />
      <div className="flex w-full gap-10">
        <div className="flex flex-1 items-center justify-center gap-5 rounded-[6px] border border-dark-gray py-4 text-[20px] text-white">
          <p>50 attemps - 10 ETH </p>
          <img
            src="https://www.iconarchive.com/download/i109534/cjdowner/cryptocurrency-flat/Ethereum-ETH.1024.png"
            alt="eth"
            className="h-8 w-8 rounded-full"
          />
        </div>
        <Button className="h-full flex-1">Connect Wallet</Button>
      </div>
      <p className="w-full font-roboto text-[16px] text-white">
        *If you run out of attempts, you can buy more for 20 ETH
      </p>
    </Card>
  );
};
