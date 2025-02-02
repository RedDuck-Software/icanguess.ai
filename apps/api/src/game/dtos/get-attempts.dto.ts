import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsNumberString, IsString } from 'class-validator';
import { GameMode } from '../game.service';

export class GetUserAttemptsDto {
  @ApiProperty({
    description: 'The game mode type',
    enum: GameMode,
    example: GameMode.EASY,
  })
  @IsEnum(GameMode)
  mode: GameMode;

  @ApiProperty({
    description: 'Request id',
    type: Number,
  })
  @IsNumberString()
  roundId: string;
}
