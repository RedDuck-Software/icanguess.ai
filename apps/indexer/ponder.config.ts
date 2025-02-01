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
      address: "0xe07b7a36aBa131572041C56da53Aa2381ad05A2f",
      network: "sepolia",
    },
  },
});
