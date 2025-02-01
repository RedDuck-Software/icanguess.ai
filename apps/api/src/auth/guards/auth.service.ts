import { Injectable } from '@nestjs/common';
import { generateNonce, SiweMessage } from 'siwe';

@Injectable()
export class AuthService {
  constructor() {}

  generateNonce(): string {
    return generateNonce();
  }

  async verify(message: string, signature: string): Promise<boolean> {
    const siweMessage = new SiweMessage(message);
    try {
      await siweMessage.verify({ signature });
      return true;
    } catch {
      return false;
    }
  }
}
