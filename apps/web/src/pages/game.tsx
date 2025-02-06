import { useMemo } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { formatUnits } from 'viem';
import { useReadContract } from 'wagmi';

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
import { useSessions } from '@/hooks/queries/use-sessions';
import { useStoredWords } from '@/hooks/queries/use-stored-words';
import { useUserGuesses } from '@/hooks/queries/use-user-guesses';
import { routes } from '@/router';
import { generateMnemonic, english } from 'viem/accounts';
import { GameMode } from '@/common';
import { useQueryChain } from '@/hooks/use-query-chain';

export default function Game() {
  const { id } = useParams();
  const navigate = useNavigate();

  const chain = useQueryChain();

  const { data: sessionsRes } = useSessions(chain.id, GameMode.EASY);
  const sessions = useMemo(() => {
    if (!sessionsRes) return [];
    return sessionsRes.data.sessions;
  }, [sessionsRes]);

  const session = useMemo(() => {
    if (!id) return null;
    const find = sessions.find((s) => s.roundId === +id);

    return find ?? null;
  }, [id, sessions]);

  // const { data: currentRoundStats } = useReadContract({
  //   abi: gameAbi,
  //   address: contractAddress,
  //   functionName: 'roundInfos',
  //   args: [BigInt(session?.roundId ?? 0)],
  //   query: {
  //     enabled: session?.roundId !== undefined && session?.roundId !== null,
  //   },
  // });

  const { data: storedWordsJSON } = useStoredWords();

  const storedWords = useMemo(() => {
    if (!session) return [];

    if (
      !storedWordsJSON ||
      (storedWordsJSON &&
        !JSON.parse(storedWordsJSON)[session.roundId.toString()])
    ) {
      const newMnemonic = generateMnemonic(english).split(' ').slice(0, 9);

      const stored = storedWordsJSON ? JSON.parse(storedWordsJSON) : {};

      localStorage.setItem(
        'words',
        JSON.stringify({
          ...stored,
          [session.roundId.toString()]: newMnemonic,
        }),
      );
      return newMnemonic;
    }
    return JSON.parse(storedWordsJSON)[session.roundId.toString()] as string[];
  }, [session, storedWordsJSON]);

  const { data: userGuesses } = useUserGuesses(chain.id, session?.roundId);

  if (!id) {
    toast.error('Please find valid game');
    navigate(routes.games);
    return null;
  }
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
      {!session ? (
        <h1 className="font-space text-[80px] text-dark">
          Please proceed to newer session
        </h1>
      ) : (
        <>
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
                      {(userGuesses?.data.attempts.attemptsBought || 0) -
                        (userGuesses?.data.attempts.attemptsUser || 0)}
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
                    {formatUnits(BigInt(session.rewardsPool), 18)} ETH
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
            <GameTimer session={session} />
          </section>
          <section className="mb-[200px] flex gap-10 px-[90px]">
            <YourAnswer session={session} />
            <PreviousAnswers session={session} />
          </section>
        </>
      )}
      <div className="flex flex-col gap-20 px-[90px]">
        <Mode />
        <Rules />
      </div>
      <Footer isDark={false} />
    </div>
  );
}
