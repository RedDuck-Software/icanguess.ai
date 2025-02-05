import { createParamDecorator } from '@nestjs/common';
import { Address } from 'viem';

export class UserClaims {
  wallet: Address;
  chainId: number;
}

export const RequestUser = createParamDecorator((data, req: any) => {
  return req.args[0].user as UserClaims;
});
