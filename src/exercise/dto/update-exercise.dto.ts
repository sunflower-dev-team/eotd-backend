import { IsOptional, IsString } from 'class-validator';

export class UpdateExerciseDto {
  @IsOptional()
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
