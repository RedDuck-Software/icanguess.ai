import { IsString, MinLength, Matches } from 'class-validator';

export class TryGuessDto {
  @IsString({ message: 'Prompt must be a string.' })
  @MinLength(3, {
    message: 'Prompt must be at least 3 characters long.',
  })
  @Matches(/^[A-Za-z0-9\s.!?]+$/, {
    message:
      'Prompt cannot contain any special characters except dot, exclamation mark, and question mark.',
  })
  prompt: string;

  @IsString()
  walletAddress: string;
}
