import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    required: true,
    example: 'example@naver.com',
    description: '인증할 수 있는 이메일',
  })
  @IsNotEmpty()
  @IsString()
  readonly e_mail: string;

  @ApiProperty({ required: true, example: '홍길동', description: '이름' })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    required: true,
    example: 'male',
    description: 'male 또는 female',
  })
  @IsNotEmpty()
  @IsString()
  readonly gender: string;

  @ApiProperty({
    required: true,
    example: 19950430,
    description: '생년월일',
  })
  @IsNotEmpty()
  @IsNumber()
  readonly birth: number;

  @ApiProperty({ required: true, example: 'q1w2e3@@', description: '비밀번호' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
