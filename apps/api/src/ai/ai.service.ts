import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

type GuessResponse = {
  guessedWord?: string;
  temperature: number;
};

export const ELIZA_CHAT_ENDPOINT = 'ELIZA_CHAT_ENDPOINT';

@Injectable()
export class AiService {
  private elizaChatEndpoint: string;

  constructor(private readonly configService: ConfigService) {
    this.elizaChatEndpoint =
      this.configService.getOrThrow<string>(ELIZA_CHAT_ENDPOINT);
  }

  async generate(prompt: string, words: string) {
    const response = await this.generateText(prompt, words);
    return response.text;
  }

  private async generateText(prompt: string, words: string) {
    const message = `You are the a helper for our service called icanguess.ai. The purpose of this bot is simple - it accepts list of words in message, and the users prompt (service will be called only from backend so its secure), and this character should answer how close Is users prompt to any of a guessed words in the list. How close user was should be a temperature value from 1 to 10, where 1 is very far, 10 - is a hit and only can be answered in case if user asked about this word directly. Also the character CANNOT reveal any of those words in any cases, only if user guessed the word. The answer should be in parsable json format. Examples:

=== Examples start ===
request: { 
  words: 'words: apple, car, building'
  promt: 'is the word is an fruit?'
}
answer: {
  temperature: 9
}

request {
  words: 'words: apple, car, building'
  promt: 'is the word is an apple?'
}
answer: {
  temperature: 10,
  guessedWord: apple
}

request {
  words: 'words: apple, car, building'
  promt: 'is the word list contains something related to structures?  '
}
answer: {
  temperature: 8,
}
=== Examples end ===
  

Real request:  
{
  words: '${words}',
  promt: '${prompt}'
}
`;

    const formData = new FormData();
    formData.append('text', message);
    formData.append('user', 'user');

    const response = await axios.post(
      `${this.elizaChatEndpoint}/message`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data[0];
  }

  async getTemperatureForPrompt(
    prompt: string,
    secretWords: string[],
  ): Promise<GuessResponse> {
    const response = await this.generate(prompt, secretWords.join(' '));

    const resp = JSON.parse(response) as GuessResponse;

    return { temperature: resp.temperature, guessedWord: resp.guessedWord };
  }
}
