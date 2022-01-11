import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCustomizedExerciseDto {
  @IsNotEmpty()
  @IsString()
  readonly exercise_name: string;

  @IsNotEmpty()
  @IsString()
  readonly target: string;

  @IsOptional()
  @IsString()
  readonly description: string;

  @IsOptional()
  @IsString({ each: true })
  readonly links: string[];

  @IsOptional()
  @IsString({ each: true })
  readonly first_aid: string[];
}
