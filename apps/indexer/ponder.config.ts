import { createConfig } from "ponder";
import { http } from "viem";

import { guessInstanceAbi } from "./abis/guessInstanceAbi";

export default createConfig({
  networks: {
    sepolia: {
      chainId: 11155111,
      transport: http(process.env.PONDER_RPC_URL_11155111),
    },
  },
  contracts: {
    UnverifiedContract: {
      abi: guessInstanceAbi,
      startBlock: 7617291,
      address: "0xe5957f88bB8dfF49960285710624B61d76484237",
      network: "sepolia",
    },
  },
});
