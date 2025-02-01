import { parseUnits } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import hre from "hardhat";

const configs = {
  [11155111 as number]: {
    roundDuration: 3 * 3600,
    roundStartBuffer: 15 * 60,
    platformFee: 10 * 100,
    platformFeeReceiver: undefined,
    depositPrice: parseUnits("0.1"),
    depositGuesses: 50n,
    startSigner: undefined,
  },
};

const deploy = async (hre: HardhatRuntimeEnvironment) => {
  const [deployer, signer] = await hre.ethers.getSigners();
  const guessInstanceFactory =
    await hre.ethers.getContractFactory("GuessInstance");

  const config = configs[hre.network.config.chainId!];

  await hre.upgrades.deployProxy(
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
      unsafeAllow: ["constructor"],
    },
  );
};

deploy(hre)
  .then(() => process.exit(0))
  .catch(console.error);
