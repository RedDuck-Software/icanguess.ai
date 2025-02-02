import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GameMode } from '../../game/game.service';

export class StartRoundDto {
  @ApiProperty({
    description: 'The round mode (easy or hard)',
    example: GameMode.EASY,
    enum: GameMode,
  })
  @IsEnum(GameMode)
  mode: GameMode;
}
