/* eslint-disable no-inline-styles/no-inline-styles */
import { NavLink } from 'react-router-dom';

import { Footer } from '@/components/footer/footer';
import { PreviousAnswers } from '@/components/game/answer/previous-answers';
import { YourAnswer } from '@/components/game/answer/your-answer';
import { GuessSeedPhrase } from '@/components/game/guess-seed-phrase';
import { GameTimer } from '@/components/game/timer/game-timer';
import { Header } from '@/components/header/header';
import { Mode } from '@/components/mode/mode';
import { Rules } from '@/components/rules/rules';
import { Card } from '@/components/ui/card';
import { routes } from '@/router';

export default function Game() {
  return (
    <div
      style={{
        backgroundImage: "url('/Noise.png')",
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto',
      }}
      className="flex min-h-screen flex-col gap-10 bg-dark"
    >
      <div className="pb-[100px] pt-10">
        <Header />
      </div>
      <section className="px-[90px]">
        <div className="flex w-full items-center gap-10">
          <NavLink className={'flex-1'} to={routes.games}>
            <Card
              variant={'light-gray'}
              className="h-[125px] flex-1 justify-center gap-2.5 px-10 py-8"
              radius={20}
            >
              <img
                src="/icons/arrow-down.svg"
                alt="arrow"
                className="rotate-90"
              />
              <p className="font-space text-[30px] uppercase">sessions</p>
            </Card>
          </NavLink>
          <Card
            variant={'light-gray'}
            className="h-[125px] flex-1 justify-between px-10 py-8"
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
            className="h-[125px] flex-1 justify-between px-10 py-8"
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
      <section className="mb-[200px] flex gap-10 px-[90px]">
        <YourAnswer />
        <PreviousAnswers />
      </section>
      <div className="flex flex-col gap-20 px-[90px]">
        <Mode />
        <Rules />
      </div>
      <Footer isDark={false} />
    </div>
  );
}
