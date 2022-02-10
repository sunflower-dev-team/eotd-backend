import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyAuthMailTokenDto {
  @ApiProperty({
    description: 'uuid',
    example: '929aa1a4-8f76-4e28-9a0b-3888ded962b5',
  })
  @IsNotEmpty()
  @IsString()
  readonly _id: string;

  @ApiProperty({
    required: true,
    example: 'GgiOjE5OTUwNDMwLCJpc1ZlcmlmeU1haWxUb2HXec',
    description: '메일토큰',
  })
  @IsNotEmpty()
  @IsString()
  readonly authMailToken: string;
}
