import { Injectable } from '@nestjs/common';
import { Address, createWalletClient, Hex, http, keccak256 } from 'viem';
import { mainnet } from 'viem/chains';
import { ConfigService } from '@nestjs/config';
import { solidityPacked } from 'ethers';

const START_ROUND_TYPEHASH = 'icanguess.io.signatures.start';

@Injectable()
export class SignaturesService {
  constructor(private readonly configService: ConfigService) {}

  async signGameStart(roundId: number, targetAddress: string) {
    const chainId = 1; // @TODO: dynamic

    const encodedData = solidityPacked(
      ['uint256', 'address', 'uint256', 'bytes32'],
      [
        roundId,
        targetAddress,
        BigInt(chainId).valueOf(),
        keccak256(Buffer.from(START_ROUND_TYPEHASH)),
      ],
    ) as Hex;

    return this.sign(keccak256(encodedData));
  }

  private async sign(message: Hex) {
    const signerPk = this.configService.getOrThrow<Address>('SIGNER_PK');

    const client = createWalletClient({
      account: signerPk,
      chain: mainnet,
      transport: http(),
    });

    return await client.signMessage({
      message: { raw: message },
      account: signerPk,
    });
  }
}
