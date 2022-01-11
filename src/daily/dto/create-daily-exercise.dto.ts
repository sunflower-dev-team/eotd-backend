import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDailyExerciseDto {
  @IsNotEmpty()
  @IsString()
  readonly exercise_name: string;

  @IsOptional()
  @IsString()
  readonly exercise_img: string;

  @IsNotEmpty()
  @IsString()
  readonly startAt: string;

  @IsNotEmpty()
  @IsString()
  readonly endAt: string;
}
