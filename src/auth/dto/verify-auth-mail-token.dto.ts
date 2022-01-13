import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyAuthMailTokenDto {
  @ApiProperty({
    required: true,
    example: 'example@naver.com',
    description: '이메일',
  })
  @IsNotEmpty()
  @IsString()
  readonly e_mail: string;

  @ApiProperty({
    required: true,
    example: 'GgiOjE5OTUwNDMwLCJpc1ZlcmlmeU1haWxUb2HXec',
    description: '메일토큰',
  })
  @IsNotEmpty()
  @IsString()
  readonly authMailToken: string;
}
