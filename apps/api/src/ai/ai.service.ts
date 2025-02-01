import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class AiService {
  constructor() {}

  async getTemperatureForPrompt({
    secretWords,
    user,
  }: {
    user: User;
    secretWords: string[];
  }): Promise<{ temerature: number }> {
    // TODO: implement
    return { temerature: 30 };
  }
}
