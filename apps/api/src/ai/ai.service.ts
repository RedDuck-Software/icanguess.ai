import { Injectable } from '@nestjs/common';

type GuessResponse = {
  word: string | null;
  temperature: number;
};

@Injectable()
export class AiService {
  constructor() {}

  // async getTemperatureForPrompt(
  //   prompt: string,
  //   secretWords: string[],
  // ): Promise<GuessResponse> {
  //   // TODO: implement
  //
  //   const response = (await elize.ask(prompt, secretWords)) as GuessResponse;
  //   return { temperature: response.temperature, word: response.word };
  // }
}
