import { IsOptional, IsString } from 'class-validator';

export class FindCustomizedExerciseDto {
  @IsOptional()
  @IsString()
  readonly exercise_name: string;

  @IsOptional()
  @IsString()
  readonly target: string;
}
