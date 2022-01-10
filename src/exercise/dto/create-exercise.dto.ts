import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateExerciseDto {
  @IsNotEmpty()
  @IsString()
  readonly exercise_name: string;

  @IsNotEmpty()
  @IsString()
  readonly target: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsOptional()
  @IsString({ each: true })
  readonly links: string[];

  @IsOptional()
  @IsString({ each: true })
  readonly first_aid: string[];
}
