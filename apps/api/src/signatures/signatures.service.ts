import { Injectable } from '@nestjs/common';
import { Address, Chain, createWalletClient, Hex, http, keccak256 } from 'viem';
import { mainnet, arbitrum, sepolia } from 'viem/chains';
import { ConfigService } from '@nestjs/config';
import { solidityPacked } from 'ethers';
import { privateKeyToAccount } from 'viem/accounts';
import { NetworkService } from 'src/network/network.service';

const START_ROUND_TYPEHASH = 'icanguess.io.signatures.start';

@Injectable()
export class SignaturesService {
  constructor(
    private readonly networkService: NetworkService,
    private readonly configService: ConfigService,
  ) {}

  async signGameStart({
    chainId,
    roundId,
    targetAddress,
  }: {
    roundId: number;
    chainId: number;
    targetAddress: string;
  }) {
    const chainConfig = this.networkService.getNetwork(chainId);

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
    const account = privateKeyToAccount(signerPk);

    const client = createWalletClient({
      account,
      chain: chainConfig,
      transport: http(),
    });

    return await client.signMessage({
      message: { raw: message },
      account,
    });
  }
}
