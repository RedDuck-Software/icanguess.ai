import { parseUnits } from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import hre from 'hardhat';

const configs = {
  [11155111 as number]: {
    roundDuration: 1 * 3600,
    roundStartBuffer: 0,
    platformFee: 10 * 100,
    platformFeeReceiver: undefined,
    depositPrice: parseUnits('0.003'),
    depositGuesses: 20n,
    startSigner: undefined,
  },
};

const deploy = async (hre: HardhatRuntimeEnvironment) => {
  const [deployer, signer] = await hre.ethers.getSigners();
  const guessInstanceFactory =
    await hre.ethers.getContractFactory('GuessInstance');

  const config = configs[hre.network.config.chainId!];

  const proxy = await hre.upgrades.deployProxy(
    guessInstanceFactory,
    [
      config.roundDuration,
      config.roundStartBuffer,
      config.platformFee,
      config.platformFeeReceiver ?? deployer.address,
      config.depositPrice,
      config.depositGuesses,
      config.startSigner ?? signer.address,
    ],
    {
      unsafeAllow: ['constructor'],
    },
  );

  console.log({ address: await proxy.getAddress(), signer: signer.address });
};

deploy(hre)
  .then(() => process.exit(0))
  .catch(console.error);
