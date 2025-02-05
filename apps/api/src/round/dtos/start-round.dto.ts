import { IsEnum, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GameMode } from 'src/network/addresses';

export class StartRoundDto {
  @ApiProperty({
    description: 'The round mode (easy or hard)',
    example: GameMode.EASY,
    enum: GameMode,
  })
  @IsEnum(GameMode)
  mode: GameMode;

  @IsNumberString()
  chainId: string;
}
