import { parseUnits } from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import hre from 'hardhat';

const deploy = async (hre: HardhatRuntimeEnvironment) => {
  const [deployer, signer] = await hre.ethers.getSigners();
  const guessInstanceFactory =
    await hre.ethers.getContractFactory('GuessInstance');

  const proxy = await hre.upgrades.upgradeProxy(
    '0x386c87Cc3b048Caba18F0638095CDa32F08eB24A',
    guessInstanceFactory,
    {
      unsafeAllow: ['constructor'],
    },
  );

  console.log({ address: await proxy.getAddress(), signer: signer.address });
};

deploy(hre)
  .then(() => process.exit(0))
  .catch(console.error);
