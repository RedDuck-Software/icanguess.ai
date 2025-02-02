/* eslint-disable no-inline-styles/no-inline-styles */
import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { formatUnits } from 'viem';
import { useReadContract, useReadContracts } from 'wagmi';

import { gameAbi } from '@/abi/game-abi';
import { Footer } from '@/components/footer/footer';
import { PreviousAnswers } from '@/components/game/answer/previous-answers';
import { YourAnswer } from '@/components/game/answer/your-answer';
import { GuessSeedPhrase } from '@/components/game/guess-seed-phrase';
import { GameTimer } from '@/components/game/timer/game-timer';
import { Header } from '@/components/header/header';
import { Mode } from '@/components/mode/mode';
import { Rules } from '@/components/rules/rules';
import { Card } from '@/components/ui/card';
import { contractAddress } from '@/constants/constants';
import { routes } from '@/router';
import { mnemonicList } from '@/lib/mnemonic-list';

export default function Game() {
  const { data } = useReadContracts({
    contracts: [
      {
        abi: gameAbi,
        address: contractAddress, // Replace with your contract address
        functionName: 'getCurrentRoundInfo', // Replace with your second function name
      },
    ],
  });

  const roundInfo = useMemo(() => {
    if (!data || !data[0].result) return null;

    return data[0].result;
  }, [data]);

  const { data: currentRoundStats } = useReadContract({
    abi: gameAbi,
    address: contractAddress,
    functionName: 'roundInfos',
    args: [roundInfo?.[0]],
  });

  const storedWords = useMemo(() => {
    const storedWordsJSON = localStorage.getItem('words');
    if (!roundInfo) return [];

    if (
      !storedWordsJSON ||
      (storedWordsJSON &&
        JSON.parse(storedWordsJSON).id !== roundInfo[0].toString())
    ) {
      const newMnemonic = Array.from(
        { length: 9 },
        (_, i) => mnemonicList[Math.floor(Math.random() * mnemonicList.length)],
      );
      localStorage.setItem(
        'words',
        JSON.stringify({ id: roundInfo[0].toString(), mnemonic: newMnemonic }),
      );
      return newMnemonic;
    }
    return JSON.parse(storedWordsJSON).mnemonic as string[];
  }, [roundInfo]);

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
          <div className="flex w-2/3 items-center gap-10">
            <NavLink className={'w-full'} to={routes.games}>
              <Card
                variant={'light-gray'}
                className="h-[125px] w-full justify-center gap-2.5 px-10 py-8"
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
              className="h-[125px] w-full justify-between px-10 py-8"
              radius={20}
            >
              <p className="font-space text-[30px] uppercase">Attempts</p>
              <div className="flex h-[60px] w-[60px] items-center justify-center rounded-[20px] border border-dark-gray">
                <p className="font-roboto text-[30px] font-medium text-dark">
                  50
                </p>
              </div>
            </Card>
          </div>
          <Card
            variant={'light-gray'}
            className="h-[125px] w-1/3 justify-between px-10 py-8"
            radius={20}
          >
            <p className="font-space text-[30px] uppercase">Reward Pool</p>
            <div className="flex items-center gap-3">
              <p className="font-roboto text-[30px] font-medium text-dark">
                {formatUnits(currentRoundStats?.[1] || 0n, 18)} ETH
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
        <GuessSeedPhrase words={storedWords} />
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
