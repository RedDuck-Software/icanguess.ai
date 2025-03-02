/* eslint-disable no-inline-styles/no-inline-styles */
import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { formatUnits } from 'viem';

import { Footer } from '@/components/footer/footer';
import { GameTimer } from '@/components/game/timer/game-timer';
import { Header } from '@/components/header/header';
import { Mode } from '@/components/mode/mode';
import { Rules } from '@/components/rules/rules';
import { Card } from '@/components/ui/card';
import type { Session as ISession } from '@/hooks/queries/use-sessions';
import { useSessions } from '@/hooks/queries/use-sessions';
import { useSectionScroll } from '@/hooks/use-section-scroll';

export default function Games() {
  const { data } = useSessions();

  const sessions = useMemo(() => {
    if (!data) return [];
    return data.data.sessions;
  }, [data]);

  const { sectionsRef } = useSectionScroll();

  return (
    <div
      style={{
        backgroundImage: "url('/Noise.png')",
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto',
      }}
      className="flex min-h-screen flex-col gap-10 bg-dark"
    >
      <div
        ref={(el) => el && (sectionsRef.current[0] = el)}
        className="h-[calc(100vh-156px)]"
      >
        <div className="pb-[140px] pt-10">
          <Header />
        </div>
        <section className="mb-[100px] px-[90px]">
          <h3 className="font-space text-[30px] uppercase leading-none text-white">
            Aurora
          </h3>
          <div className="flex w-full items-center gap-10">
            {sessions.map((s, i) => (
              <Session index={i} key={s.roundId} session={s} />
            ))}
          </div>
        </section>
        <section className="px-[90px]">
          <h3 className="font-space text-[30px] uppercase leading-none text-white">
            Sepolia
          </h3>
          <div className="flex w-full items-center gap-10">
            {sessions.map((s, i) => (
              <Session index={i} key={s.roundId} session={s} />
            ))}
          </div>
        </section>
      </div>

      <div className="flex flex-col gap-10 px-[90px]">
        <Mode ref={(el) => el && (sectionsRef.current[1] = el)} />
        <Rules ref={(el) => el && (sectionsRef.current[2] = el)} />
      </div>
      <Footer
        isDark={false}
        ref={(el) => el && (sectionsRef.current[3] = el)}
      />
    </div>
  );
}

const Session = ({ session, index }: { session: ISession; index: number }) => {
  return (
    <NavLink
      to={'/' + session.roundId.toString()}
      className="flex w-full flex-1 flex-col gap-2.5"
    >
      <Card
        variant={'purple'}
        className="h-[125px] flex-1 justify-between px-8 py-8"
        radius={20}
      >
        <div className="flex flex-col">
          <p className="font-space text-[30px] uppercase leading-none">
            {index + 1} session
          </p>
          <p className="font-roboto text-[16px] text-dark/50">Easy Mode</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <p className="font-roboto text-[30px] font-medium leading-none text-dark">
              {formatUnits(BigInt(session.rewardsPool.toFixed()), 18)} ETH
            </p>
            <p className="font-roboto text-[16px] text-dark/50"> Reward Pool</p>
          </div>
          <img
            src="https://www.iconarchive.com/download/i109534/cjdowner/cryptocurrency-flat/Ethereum-ETH.1024.png"
            alt="ETH"
            className="h-10 w-10 rounded-full"
          />
        </div>
      </Card>
      <GameTimer
        className="w-full"
        timestamp={session.roundEndTs}
        session={session}
      />
    </NavLink>
  );
};
