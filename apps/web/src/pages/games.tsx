/* eslint-disable no-inline-styles/no-inline-styles */
import { NavLink } from 'react-router-dom';

import { Footer } from '@/components/footer/footer';
import { GameTimer } from '@/components/game/timer/game-timer';
import { Header } from '@/components/header/header';
import { Mode } from '@/components/mode/mode';
import { Rules } from '@/components/rules/rules';
import { Card } from '@/components/ui/card';
import { useSectionScroll } from '@/hooks/use-section-scroll';
import { routes } from '@/router';

export default function Games() {
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
        <section className="px-[90px]">
          <div className="flex w-full items-center gap-10">
            <Session />
            <Session />
            <Session />
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

const Session = () => {
  return (
    <NavLink to={routes.game} className="flex w-full flex-1 flex-col gap-2.5">
      <Card
        variant={'purple'}
        className="h-[125px] flex-1 justify-between px-10 py-8"
        radius={20}
      >
        <div className="flex flex-col">
          <p className="font-space text-[30px] uppercase leading-none">
            1 session
          </p>
          <p className="font-roboto text-[16px] text-dark/50">Easy Mode</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <p className="font-roboto text-[30px] font-medium leading-none text-dark">
              500 ETH
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
      <GameTimer className="w-full" />
    </NavLink>
  );
};
