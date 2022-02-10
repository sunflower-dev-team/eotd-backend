import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDailyRoutineDto {
  @ApiProperty({
    description: '데일리 운동 타이틀',
    example: '잊혀지지 않을 스미스 머신',
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: '운동한 시간',
    example: '01:20',
    required: false,
  })
  @IsOptional()
  @IsString()
  time: string;

  @ApiProperty({
    description: '운동 인증 사진',
    example:
      'https://media.vlpt.us/images/peter0618/post/51a9e282-ae0a-46ef-85bd-8ab0a36747fc/Nestjs.png',
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  imgs: string[];
}
