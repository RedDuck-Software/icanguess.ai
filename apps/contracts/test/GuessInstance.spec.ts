import hre from "hardhat";
import { parseUnits } from "ethers";
describe("GuessInstance", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    const [startSigner, feeReceiver] = await hre.ethers.getSigners();

    const roundDuration = 3 * 3600;
    const roundStartBuffer = 15 * 60;
    const platformFee = 10 * 100;
    const depositPrice = parseUnits("0.1");
    const depositGuesses = 50n;

    const platformFeeReceiver = feeReceiver.address;

    // Contracts are deployed using the first signer/account by default

    const guessInstanceFactory =
      await hre.ethers.getContractFactory("GuessInstance");

    const guessInstance = await guessInstanceFactory.deploy();

    await guessInstance.initialize(
      roundDuration,
      roundStartBuffer,
      platformFee,
      platformFeeReceiver,
      depositPrice,
      depositGuesses,
      startSigner,
    );

    return {
      guessInstance,
      roundDuration,
      roundStartBuffer,
      platformFee,
      depositPrice,
      depositGuesses,
      platformFeeReceiver,
    };
  }

  describe("Deployment", function () {});
});
