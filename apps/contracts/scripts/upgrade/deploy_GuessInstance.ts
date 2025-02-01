import { parseUnits } from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import hre from 'hardhat';

const deploy = async (hre: HardhatRuntimeEnvironment) => {
  const [deployer, signer] = await hre.ethers.getSigners();
  const guessInstanceFactory =
    await hre.ethers.getContractFactory('GuessInstance');

  const proxy = await hre.upgrades.upgradeProxy(
    '0xD46D8f9e1B03bC0BFDa065A1797d45c64d66902c',
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
