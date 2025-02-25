import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "@nomicfoundation/hardhat-verify";
import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  etherscan: {
    apiKey: process.env.ETHERSCAN_API,
  },
  networks: {
    sepolia: {
      chainId: 11155111,
      url: "https://sepolia.drpc.org",
      accounts: {
        mnemonic: process.env.DEPLOYER_MNEMONIC,
      },
    },
  },
};

export default config;
