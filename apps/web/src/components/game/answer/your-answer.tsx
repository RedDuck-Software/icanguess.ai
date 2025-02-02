import { useMemo, useState } from 'react';
import { toast } from 'sonner';
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
import { formatUnits } from 'viem';
import { useAppKit } from '@reown/appkit/react';

export const YourAnswer = () => {
  const { address } = useAccount();
  const { open } = useAppKit();

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
      {
        abi: gameAbi,
        address: contractAddress, // Replace with your contract address
        functionName: 'getCurrentRoundInfo', // Replace with your second function name
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

  const roundInfo = useMemo(() => {
    if (!data || !data[2].result) return null;

    return data[2].result;
  }, [data]);

  const { data: currentRoundStats } = useReadContract({
    abi: gameAbi,
    address: contractAddress,
    functionName: 'roundInfos',
    args: [roundInfo?.[0]],
  });
  console.log(currentRoundStats);

  const buttonText = useMemo(() => {
    if (!address) return 'Connect Wallet';
  }, [address]);

  const [loading, setLoading] = useState(false);
  const [word, setWord] = useState('');
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const onClick = async () => {
    if (!currentRoundStats) return;
    setLoading(true);
    if (!address) {
      open();
      return;
    }
    const id = toast.loading('Loading...');
    try {
      let tx: `0x${string}` | null = null;

      if (currentRoundStats[1] === 0n) {
        tx = await writeContractAsync({
          abi: gameAbi,
          address: contractAddress,
          functionName: 'depositWithSig',
          args: [''],
        });
      } else {
        tx = await writeContractAsync({
          abi: gameAbi,
          address: contractAddress,
          functionName: 'deposit',
        });
      }

      if (!tx) {
        toast.dismiss(id);
        return;
      }

      await publicClient?.waitForTransactionReceipt({ hash: tx });

      toast.dismiss(id);
      toast.success('Success');
    } catch (error) {
      if (error instanceof Error) {
        toast.dismiss(id);
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

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
        <Button onClick={onClick} className="h-full flex-1">
          {buttonText}
        </Button>
      </div>
      <p className="w-full font-roboto text-[16px] text-white">
        *If you run out of attempts, you can buy more for {attempsToBuy} ETH
      </p>
    </Card>
  );
};
