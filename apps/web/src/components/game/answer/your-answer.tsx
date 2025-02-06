import { useAppKit } from '@reown/appkit/react';
import { AxiosError } from 'axios';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { encodeAbiParameters, formatUnits, zeroAddress } from 'viem';
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useReadContracts,
  useWriteContract,
} from 'wagmi';

import { gameAbi } from '@/abi/game-abi';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { contractAddress } from '@/constants/constants';
import { useStartRound } from '@/hooks/mutations/use-start-round';
import { useTakeGuess } from '@/hooks/mutations/use-take-guess';
import type { Session } from '@/hooks/queries/use-sessions';
import { useStoredWords } from '@/hooks/queries/use-stored-words';
import { useUserGuesses } from '@/hooks/queries/use-user-guesses';
import { useQueryChain } from '@/hooks/use-query-chain';
import { GameMode } from '@/common';

interface Props {
  session: Session;
}
export const YourAnswer = ({ session }: Props) => {
  const { address } = useAccount();
  const { open } = useAppKit();

  const chain = useQueryChain();
  const { data } = useReadContracts({
    contracts: [
      {
        abi: gameAbi,
        address: contractAddress, // Replace with your contract address
        functionName: 'depositPrice', // Replace with your first function name
      },
      {
        abi: gameAbi,
        address: contractAddress, // Replace with your contract address
        functionName: 'guessPassAmount', // Replace with your second function name
      },
    ],
  });
  const depositPrice = useMemo(() => {
    if (!data || !data[0].result) return '0';
    return formatUnits(data[0].result, 18);
  }, [data]);

  const attempsToBuy = useMemo(() => {
    if (!data || !data[1].result) return '0';
    return data[1].result.toString();
  }, [data]);

  const { data: currentRoundStats } = useReadContract({
    abi: gameAbi,
    address: contractAddress,
    functionName: 'roundInfos',
    args: [BigInt(session.roundId)],
  });

  const buttonText = useMemo(() => {
    if (!address) return 'Connect Wallet';

    return 'Take a guess';
  }, [address]);

  const [temperature, setTemperature] = useState<null | number>(null);

  const [loading, setLoading] = useState(false);
  const [word, setWord] = useState('');
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const { mutateAsync: startRoundWithSig } = useStartRound();
  const { data: userGuesses } = useUserGuesses(session?.roundId);
  const { mutateAsync: takeGuess } = useTakeGuess();
  const { data: storedWords } = useStoredWords();
  const onClick = async () => {
    if (!address) {
      open();
      return;
    }
    if (!currentRoundStats || !userGuesses || !storedWords || !data) return;
    setLoading(true);

    const id = toast.loading('Loading...');
    try {
      let tx: `0x${string}` | null = null;

      if (
        userGuesses.data.attempts.attemptsBought -
          userGuesses.data.attempts.attemptsUser ===
        0
      ) {
        if (currentRoundStats[0] === zeroAddress) {
          try {
            const res = await startRoundWithSig({
              mode: GameMode.EASY,
              chainId: chain.id,
            });
            const signature = encodeAbiParameters(
              [
                { name: 'x', type: 'address' },
                { name: 'sig', type: 'bytes' },
              ],
              [res.data.targetAddress, res.data.signature],
            );

            tx = await writeContractAsync({
              abi: gameAbi,
              address: contractAddress,
              functionName: 'depositWithSig',
              args: [signature],
              value: data[0].result,
            });
          } catch (error) {
            if (error instanceof AxiosError && error.status === 409) {
              tx = await writeContractAsync({
                abi: gameAbi,
                address: contractAddress,
                functionName: 'deposit',
                value: data[0].result,
              });
            } else {
              throw error;
            }
          }
        } else {
          tx = await writeContractAsync({
            abi: gameAbi,
            address: contractAddress,
            functionName: 'deposit',
            value: data[0].result,
          });
        }
      } else if (
        userGuesses.data.attempts.attemptsBought -
          userGuesses.data.attempts.attemptsUser >
        0
      ) {
        const res = await takeGuess({
          prompt: word,
          roundId: session.roundId,
          chainId: chain.id,
        });

        if (res) {
          setTemperature(res.data.temperature);
          if (res.data.word) {
            const storedAll = JSON.parse(storedWords) as Record<
              string,
              string[]
            >;
            const stored = storedAll[session.roundId.toString()] as string[];
            stored[res.data.wordIndex! + 9] = res.data.word;
            localStorage.setItem(
              'words',
              JSON.stringify({
                ...storedAll,
                [session.roundId]: { ...stored },
              }),
            );
          }
        } else {
          console.log('SOMETHING WENT WRONG');
        }
      }

      // tx = await writeContractAsync({
      //   abi: gameAbi,
      //   address: contractAddress,
      //   functionName: 'claim',
      //   args: [''],
      // });

      if (tx) {
        await publicClient?.waitForTransactionReceipt({ hash: tx });
      }

      toast.dismiss(id);
      toast.success('Success');
    } catch (error) {
      console.log(error);

      toast.dismiss(id);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message?.[0] || error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const leftValue =
    temperature !== null ? `${(temperature / 10) * 100}%` : '0%';

  return (
    <Card className="w-2/3 flex-col gap-10 p-10" variant={'dark'} radius={20}>
      <div className="flex w-full gap-10">
        <h2 className="font-space text-[30px] uppercase text-white">
          Your Answer result
        </h2>
      </div>
      <div className="relative mb-[24px] h-6 w-full rounded-[20px] bg-gradient-to-r from-[#4F43EE] via-[#9C3283] to-[#E82019]">
        <p className="absolute -bottom-8 left-0 font-roboto text-[16px] text-white/50">
          Very Cold
        </p>
        <p className="absolute -bottom-8 left-1/3 font-roboto text-[16px] text-white/50">
          Cold
        </p>
        <p className="absolute -bottom-8 right-1/3 font-roboto text-[16px] text-white/50">
          Warm
        </p>
        <p className="absolute -bottom-8 right-0 font-roboto text-[16px] text-white/50">
          Hot
        </p>

        <motion.div
          initial={{ left: '0%' }}
          animate={{ left: leftValue }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute top-[-4px] h-[32px] w-[4px] rounded bg-white"
        />
      </div>
      <Input
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="Enter question to AI"
      />
      <div className="flex w-full gap-10">
        <div className="flex flex-1 items-center justify-center gap-5 rounded-[6px] border border-dark-gray py-4 text-[20px] text-white">
          <p>
            {attempsToBuy} attemps - {depositPrice} ETH{' '}
          </p>
          <img
            src="https://www.iconarchive.com/download/i109534/cjdowner/cryptocurrency-flat/Ethereum-ETH.1024.png"
            alt="eth"
            className="h-8 w-8 rounded-full"
          />
        </div>
        <Button
          disabled={loading || (address && word.length < 3)}
          onClick={onClick}
          className="h-full flex-1"
        >
          {buttonText}
        </Button>
      </div>
      <p className="w-full font-roboto text-[16px] text-white">
        *If you run out of attempts, you can buy more for {depositPrice} ETH
      </p>
    </Card>
  );
};
