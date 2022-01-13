import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateDailyExerciseDto } from './create-daily-exercise.dto';

export class UpdateDailyExerciseBodyDto extends PartialType(
  CreateDailyExerciseDto,
) {}

export class UpdateDailyExerciseQueryDto {
  @ApiProperty({ description: '날짜', example: 20220113 })
  @IsNotEmpty()
  @IsNumber()
  readonly date: number;

  @ApiProperty({
    description: '데일리 운동 ID',
    example: '06320d52-735a-40d1-a6cb-19e99932181c',
  })
  @IsNotEmpty()
  @IsString()
  readonly exercise_id: string;
}
