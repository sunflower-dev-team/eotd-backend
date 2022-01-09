import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDailyExerciseBodyDto {
  @IsOptional()
  @IsString({ each: true })
  readonly exercise_list: string[];

  @IsOptional()
  @IsString()
  readonly exercise_img: string;

  @IsOptional()
  @IsString()
  readonly startAt: string;

  @IsOptional()
  @IsString()
  readonly endAt: string;
}

export class UpdateDailyExerciseQueryDto {
  @IsNotEmpty()
  @IsNumber()
  readonly date: number;

  @IsNotEmpty()
  @IsString()
  readonly exercise_id: string;
}
