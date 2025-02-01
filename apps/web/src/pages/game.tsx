import { PreviousAnswers } from '@/components/game/answer/previous-answers';
import { YourAnswer } from '@/components/game/answer/your-answer';
import { GuessSeedPhrase } from '@/components/game/guess-seed-phrase';
import { GameTimer } from '@/components/game/timer/game-timer';
import { Rules } from '@/components/rules/rules';
import { Card } from '@/components/ui/card';

export default function Game() {
  return (
    <div className="flex min-h-screen flex-col gap-10 pt-[100px]">
      <section className="px-[90px]">
        <div className="flex w-full items-center gap-10">
          <Card
            variant={'light-gray'}
            className="flex-1 justify-between px-10 py-8"
            radius={20}
          >
            <p className="font-space text-[30px] uppercase">Attempts</p>
            <div className="flex h-[60px] w-[60px] items-center justify-center rounded-[20px] border border-dark-gray">
              <p className="font-roboto text-[30px] font-medium text-dark">
                50
              </p>
            </div>
          </Card>
          <Card
            variant={'light-gray'}
            className="flex-1 justify-between px-10 py-8"
            radius={20}
          >
            <p className="font-space text-[30px] uppercase">Reward Pool</p>
            <div className="flex items-center gap-3">
              <p className="font-roboto text-[30px] font-medium text-dark">
                500 ETH
              </p>
              <img
                src="https://www.iconarchive.com/download/i109534/cjdowner/cryptocurrency-flat/Ethereum-ETH.1024.png"
                alt="ETH"
                className="h-10 w-10 rounded-full"
              />
            </div>
          </Card>
        </div>
      </section>
      <section className="flex gap-10 px-[90px]">
        <GuessSeedPhrase />
        <GameTimer />
      </section>
      <section className="flex gap-10 px-[90px]">
        <YourAnswer />
        <PreviousAnswers />
      </section>
      <Rules />
    </div>
  );
}
