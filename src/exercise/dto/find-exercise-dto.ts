import { IsOptional, IsString } from 'class-validator';

export class FindExerciseDto {
  @IsOptional()
  @IsString()
  exercise_name: string;

  @IsOptional()
  @IsString()
  target: string;
}
