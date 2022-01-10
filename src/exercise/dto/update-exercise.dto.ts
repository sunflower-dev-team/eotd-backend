import { IsOptional, IsString } from 'class-validator';

export class UpdateExerciseDto {
  @IsOptional()
  @IsString()
  target: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString({ each: true })
  links: string[];

  @IsOptional()
  @IsString({ each: true })
  first_aid: string[];
}
