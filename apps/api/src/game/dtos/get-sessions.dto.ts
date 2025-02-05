import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsNumberString, IsString } from 'class-validator';
import { GameMode } from 'src/network/addresses';

export class GetSessionsDto {
  @ApiProperty({
    description: 'The game mode type',
    enum: GameMode,
    example: GameMode.EASY,
  })
  @IsEnum(GameMode)
  mode: GameMode;

  @ApiProperty({
    description: 'The network id',
    example: 11155111,
  })
  @IsNumberString()
  chainId: string;
}
