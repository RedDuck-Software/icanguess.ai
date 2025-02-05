import { IsNumberString } from 'class-validator';

export class GetHistoryDto {
  @IsNumberString()
  roundId: string;

  @IsNumberString()
  chainId: string;
}
