import { Card } from '@/components/ui/card';
import React from 'react';

type Props = {};

export const PreviousAnswers = (props: Props) => {
  return (
    <Card className="w-1/3 flex-col gap-10 p-10" variant={'dark'} radius={20}>
      <div className="flex w-full gap-10">
        <h2 className="text-left font-space text-[30px] uppercase text-white">
          previous attempts
        </h2>
      </div>
    </Card>
  );
};
