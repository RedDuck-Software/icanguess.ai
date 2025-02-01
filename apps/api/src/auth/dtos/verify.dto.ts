import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyDto {
  @ApiProperty({
    example: '0x7115240a3d2b58112C74968fEA7cdea944D9b10c',
    description: 'Wallet address',
  })
  @IsString()
  @IsNotEmpty()
  wallet: string;

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
