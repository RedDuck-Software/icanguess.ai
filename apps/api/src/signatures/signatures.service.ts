import { Injectable } from '@nestjs/common';
import { Address, Chain, createWalletClient, Hex, http, keccak256 } from 'viem';
import { mainnet, arbitrum, sepolia } from 'viem/chains';
import { ConfigService } from '@nestjs/config';
import { solidityPacked } from 'ethers';

const START_ROUND_TYPEHASH = 'icanguess.io.signatures.start';

@Injectable()
export class SignaturesService {
  constructor(private readonly configService: ConfigService) {}

  async signGameStart(roundId: number, targetAddress: string) {
    const chainId = Number(
      this.configService.get<string>('CHAIN_ID') || sepolia.id,
    );
    const chainConfig = this.getChainConfig(chainId);

    const encodedData = solidityPacked(
      ['uint256', 'address', 'uint256', 'bytes32'],
      [
        roundId,
        targetAddress,
        chainId,
        keccak256(Buffer.from(START_ROUND_TYPEHASH)),
      ],
    ) as Hex;

    return this.sign(keccak256(encodedData), chainConfig);
  }

  private async sign(message: Hex, chainConfig: Chain) {
    const signerPk = this.configService.getOrThrow<Address>('SIGNER_PK');

    const client = createWalletClient({
      account: signerPk,
      chain: chainConfig,
      transport: http(),
    });

    return await client.signMessage({
      message: { raw: message },
      account: signerPk,
    });
  }

  private getChainConfig(chainId: number) {
    const chainMapping: Record<number, Chain> = {
      [mainnet.id]: mainnet,
      [arbitrum.id]: arbitrum,
      [sepolia.id]: sepolia,
    };

    return chainMapping[chainId] || mainnet;
  }
}
