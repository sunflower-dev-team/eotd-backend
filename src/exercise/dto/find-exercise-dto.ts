import { IsOptional, IsString } from 'class-validator';

export class FindExerciseDto {
  @IsOptional()
  @IsString()
  readonly exercise_name: string;

  @IsOptional()
  @IsString()
  readonly target: string;
}
