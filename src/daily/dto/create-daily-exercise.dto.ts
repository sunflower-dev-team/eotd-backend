import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDailyExerciseDto {
  @IsNotEmpty()
  @IsString({ each: true })
  readonly exercise_list: string[];

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
