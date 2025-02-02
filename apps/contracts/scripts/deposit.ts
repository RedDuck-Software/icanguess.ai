import { parseUnits } from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import hre, { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import keccak256 from 'keccak256';

export const createStartPayload = async (
  signer: SignerWithAddress,
  target: string,
  roundId: bigint,
  chainId: number,
) => {
  const signMsg = keccak256(
    ethers.solidityPacked(
      ['uint256', 'address', 'uint256', 'bytes32'],
      [
        roundId,
        target,
        BigInt(chainId).valueOf(),
        keccak256(Buffer.from('icanguess.io.signatures.start')),
      ],
    ),
  );

  const signature = await signer.signMessage(signMsg);

  return ethers.AbiCoder.defaultAbiCoder().encode(
    ['address', 'bytes'],
    [target, signature],
  );
};

const getCurrentRoundInfo = (
  timestamp: bigint,
  roundDuration: bigint,
  roundStartBuffer: bigint,
) => {
  const currentRoundId = timestamp / roundDuration;
  const roundStart = currentRoundId * roundDuration;
  const roundEnd = roundStart + roundDuration;
  const roundStartBufferEnd = roundStart + roundStartBuffer;

  return { currentRoundId, roundStart, roundEnd, roundStartBufferEnd };
};

const deploy = async (hre: HardhatRuntimeEnvironment) => {
  const [deployer, signer, testTarget] = await hre.ethers.getSigners();
  const guessInstance = await hre.ethers.getContractAt(
    'GuessInstance',
    '0xD46D8f9e1B03bC0BFDa065A1797d45c64d66902c',
  );

  const timestamp = BigInt(Math.floor(new Date().getTime() / 1000));

  const currentRoundId = timestamp / 86400n;

  const payload = await createStartPayload(
    signer,
    testTarget.address,
    currentRoundId,
    hre.network.config.chainId!,
  );

  // const tx = await guessInstance.depositWithSig(payload, {
  //   value: parseUnits('0.003'),
  //   // gasLimit: 300_000,
  // });

  const tx = await guessInstance.deposit({
    value: parseUnits('0.003'),
    // gasLimit: 300_000,
  });

  console.log(tx.hash);
};

deploy(hre)
  .then(() => process.exit(0))
  .catch(console.error);
