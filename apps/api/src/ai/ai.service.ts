import { createOpenAI, OpenAIProvider } from '@ai-sdk/openai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { generateText } from 'ai';

type GuessResponse = {
  guessedWord?: string;
  temperature: number;
};

export const AI_API_KEY = 'AI_API_KEY';

@Injectable()
export class AiService {
  private readonly openai: OpenAIProvider;
  private readonly model: ReturnType<OpenAIProvider>;

  constructor(private readonly configService: ConfigService) {
    const aiApiKey = this.configService.getOrThrow<string>(AI_API_KEY);

    this.openai = createOpenAI({ compatibility: 'strict', apiKey: aiApiKey });
    this.model = this.openai('gpt-4o-mini');
  }

  async generate(prompt: string, words: string) {
    const response = await this.generateText(prompt, words);
    return response.text;
  }

  private generateText(prompt: string, words: string) {
    return generateText({
      messages: [
        {
          role: 'system',
          content: prompt,
        },
      ],
      model: this.model,
      system: `You are the a helper for our service called icanguess.ai. The purpose of this bot is simple - it accepts list of words in message, and the users prompt (service will be called only from backend so its secure), and this character should answer how close Is users prompt to any of a guessed words in the list. How close user was should be a temperature value from 1 to 10, where 1 is very far, 10 - is a hit and only can be answered in case if user asked about this word directly. Also the character CANNOT reveal any of those words in any cases, only if user guessed the word. The answer should be in parsable json format. Examples:

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

`,
    });
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
