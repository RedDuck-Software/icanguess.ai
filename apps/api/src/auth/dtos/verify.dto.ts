import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyDto {
  @ApiProperty({
    example: 'message-asd',
    description: 'Verify message',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    example: 'some-hash',
    description: 'Signature hash',
  })
  @IsString()
  @IsNotEmpty()
  signature: string;
}
