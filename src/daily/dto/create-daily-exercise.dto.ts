import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class ExerciseSetInfo {
  @ApiProperty({
    description: '한 세트 횟수',
    example: 10,
  })
  readonly count: number;

  @ApiProperty({
    description: '한 세트 중량',
    example: 70,
  })
  readonly kg: number;
}

export class CreateDailyExerciseDto {
  @ApiProperty({
    description: '운동 이름',
    example: '플렛 벤치 프레스',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({ type: [ExerciseSetInfo] })
  @IsOptional()
  @IsObject({ each: true })
  readonly set: {
    readonly count: number;
    readonly kg: number;
  };
}
