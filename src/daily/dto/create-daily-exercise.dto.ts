import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDailyExerciseDto {
  @ApiProperty({
    description: '운동 이름',
    example: '벤치프레스',
  })
  @IsNotEmpty()
  @IsString()
  readonly exercise_name: string;

  @ApiProperty({
    description: '운동 인증 사진',
    example:
      'https://media.vlpt.us/images/peter0618/post/51a9e282-ae0a-46ef-85bd-8ab0a36747fc/Nestjs.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly exercise_img: string;

  @ApiProperty({
    description: '운동 시작 시간',
    example: '08:00',
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  readonly startAt: string;

  @ApiProperty({
    description: '운동 종료 시간',
    example: '08:15',
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  readonly endAt: string;
}
