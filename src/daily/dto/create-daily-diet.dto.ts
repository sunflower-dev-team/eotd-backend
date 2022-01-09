import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDailyDietDto {
  @IsNotEmpty()
  @IsString()
  readonly diet_type: string;

  @IsOptional()
  @IsString()
  readonly details: string;

  @IsOptional()
  @IsString()
  readonly time: string;

  @IsOptional()
  @IsString()
  readonly meal_img: string;

  @IsNotEmpty()
  @IsNumber()
  readonly rate: number;
}
