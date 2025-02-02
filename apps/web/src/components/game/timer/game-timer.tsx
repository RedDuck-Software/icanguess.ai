/* eslint-disable no-inline-styles/no-inline-styles */
import { motion, AnimatePresence } from 'framer-motion'; // Добавлен AnimatePresence
import type { HtmlHTMLAttributes } from 'react';
import { useEffect, useState } from 'react';
import { useReadContract } from 'wagmi';

import { formatTimeFromSecToHuman } from '../../../lib/utils';

import { gameAbi } from '@/abi/game-abi';
import { Card } from '@/components/ui/card';
import { contractAddress } from '@/constants/constants';
import type { Session } from '@/hooks/queries/use-sessions';
import { cn, formatTimeFromSecToDate } from '@/lib/utils';

interface Props extends HtmlHTMLAttributes<HTMLDivElement> {
  timestamp?: number;
  session?: Session | null;
}

export const GameTimer = ({ className, session }: Props) => {
  const { data: currentRoundInfo } = useReadContract({
    abi: gameAbi,
    address: contractAddress,
    functionName: 'getCurrentRoundInfo',
  });

  const endTimeSeconds = session
    ? session.roundEndTs
    : currentRoundInfo?.[2]
      ? Number(currentRoundInfo[2].toString())
      : null;

  const startTimeSeconds = session
    ? session.roundStartTs
    : currentRoundInfo?.[1]
      ? Number(currentRoundInfo[1].toString())
      : null;

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!endTimeSeconds) return;
    const interval = setInterval(() => {
      setTimeLeft(getRemainingTime(endTimeSeconds * 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [endTimeSeconds]);

  return (
    <Card
      className={cn('w-1/3 flex-col gap-10 p-10', className)}
      variant={'dark'}
      radius={20}
    >
      <div className="flex w-full items-center justify-between gap-4">
        <TimeUnit label="Hours" value={timeLeft.hours} />
        <p className="text-2xl text-[#A6A6A6]">:</p>
        <TimeUnit label="Minutes" value={timeLeft.minutes} />
        <p className="text-2xl text-[#A6A6A6]">:</p>
        <TimeUnit label="Seconds" value={timeLeft.seconds} />
      </div>
      <div className="flex w-full flex-col gap-5">
        <Label
          title="Date Started"
          value={formatTimeFromSecToDate(startTimeSeconds)}
        />
        <Label
          title="Time Started"
          value={formatTimeFromSecToHuman(startTimeSeconds)}
        />
        <Label
          title="Date End"
          value={formatTimeFromSecToDate(endTimeSeconds)}
        />
        <Label
          title="Time End"
          value={formatTimeFromSecToHuman(endTimeSeconds)}
        />
      </div>
    </Card>
  );
};

type LabelProps = {
  title: string;
  value: string;
};

function getRemainingTime(desiredTimestamp: number) {
  const currentTime = Date.now();
  if (currentTime > desiredTimestamp)
    return { hours: 0, minutes: 0, seconds: 0 };
  const targetTime = new Date(desiredTimestamp);

  const now = new Date();
  const diff = targetTime.getTime() - now.getTime();

  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { hours, minutes, seconds };
}

type TimeUnitProps = {
  label: string;
  value: number;
};

const TimeUnit = ({ label, value }: TimeUnitProps) => {
  return (
    <div className="flex w-[120px] flex-col items-center gap-2 rounded-[20px] border border-dark-gray py-3 pb-1.5">
      <AnimatePresence mode="wait">
        <motion.p
          key={value}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="text-center font-roboto text-[32px] text-white"
        >
          {value.toString().padStart(2, '0')}
        </motion.p>
      </AnimatePresence>
      <p className="font-roboto text-[16px] text-white/50">{label}</p>
    </div>
  );
};

const Label = ({ title, value }: LabelProps) => {
  return (
    <div className="flex w-full items-center justify-between gap-5 font-roboto text-[20px] text-white">
      <p className="whitespace-nowrap">{title}</p>
      <span
        className="mx-2 h-[4px] flex-1"
        style={{
          backgroundImage:
            'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '6px 6px',
          backgroundRepeat: 'repeat-x',
        }}
      ></span>
      <p>{value}</p>
    </div>
  );
};
