import { Card } from '@/components/ui/card';

export const PreviousAnswers = () => {
  return (
    <Card className="w-1/3 flex-col gap-10 p-10" variant={'dark'} radius={20}>
      <div className="flex w-full gap-10">
        <h2 className="text-left font-space text-[30px] uppercase text-white">
          previous attempts
        </h2>
      </div>
      <div className="flex max-h-[300px] w-full flex-col gap-10 overflow-y-auto">
        <Words label="Hot" words={['ABOBA', 'ABIBA']} />
        <Words label="Warm" words={['ABOBA', 'ABIBA']} />
        <Words label="Cold" words={['ABOBA', 'ABIBA']} />
        <Words label="Very Cold" words={['ABOBA', 'ABIBA']} />
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
