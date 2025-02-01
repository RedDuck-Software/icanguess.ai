/* eslint-disable no-inline-styles/no-inline-styles */
import { Card } from '@/components/ui/card';
import React from 'react';

type Props = {};

export const GameTimer = (props: Props) => {
  return (
    <Card className="w-1/3 flex-col gap-10 p-10" variant={'dark'} radius={20}>
      <div className="flex w-[400px] flex-col gap-5">
        <Label title="Participants" value="500" />
        <Label title="Date Started" value="01.02.2025" />
        <Label title="Time Started" value="12:00 PM" />
      </div>
    </Card>
  );
};

type LabelProps = {
  title: string;
  value: string;
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
