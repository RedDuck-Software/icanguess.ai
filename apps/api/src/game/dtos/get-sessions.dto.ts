import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { GameMode } from '../game.service';

export class GetSessionsDto {
  @ApiProperty({
    description: 'The game mode type',
    enum: GameMode,
    example: GameMode.EASY,
  })
  @IsEnum(GameMode)
  mode: GameMode;
}
