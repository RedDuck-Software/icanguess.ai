import { useMemo } from 'react';

import { Card } from '@/components/ui/card';
import { useRoundHistory } from '@/hooks/queries/use-round-history';
import type { Session } from '@/hooks/queries/use-sessions';

interface Props {
  session: Session;
}
export const PreviousAnswers = ({ session }: Props) => {
  const { data: roundHistory } = useRoundHistory(session.roundId);
  const words = useMemo(() => {
    if (!roundHistory) return null;

    return {
      hot: roundHistory.data.history
        .filter((word) => word.temperature > 7)
        .map((word) => word.userPromt),

      warm: roundHistory.data.history
        .filter((word) => word.temperature > 4 && word.temperature <= 7)
        .map((word) => word.userPromt),
      cold: roundHistory.data.history
        .filter((word) => word.temperature > 2 && word.temperature <= 4)
        .map((word) => word.userPromt),

      vCold: roundHistory.data.history
        .filter((word) => word.temperature > 0 && word.temperature <= 2)
        .map((word) => word.userPromt),
    };
  }, [roundHistory]);

  return (
    <Card className="w-1/3 flex-col gap-10 p-10" variant={'dark'} radius={20}>
      <div className="flex w-full gap-10">
        <h2 className="text-left font-space text-[30px] uppercase text-white">
          previous attempts
        </h2>
      </div>
      <div className="flex max-h-[300px] w-full flex-col gap-10 overflow-y-auto">
        {words ? (
          <>
            <Words label="Hot" words={words.hot} />
            <Words label="Warm" words={words.warm} />
            <Words label="Cold" words={words.cold} />
            <Words label="Very Cold" words={words.vCold} />
          </>
        ) : null}
      </div>
    </Card>
  );
};

type WordsProps = { label: string; words: string[] };
const Words = ({ label, words }: WordsProps) => {
  if (words.length === 0) return null;

  return (
    <div className="flex w-full flex-col gap-5">
      <h6 className="font-space text-[20px] text-white">{label}</h6>
      <div className="flex flex-wrap gap-5">
        {words.map((word) => (
          <div key={word} className="rounded-[6px] bg-dark-gray px-5 py-4">
            <p className="font-roboto text-[20px] text-white">{word}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
