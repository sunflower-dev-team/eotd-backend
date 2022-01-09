import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateDailyDietBodyDto {
  @IsOptional()
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

  @IsOptional()
  @IsNumber()
  readonly rate: number;
}

export class UpdateDailyDietQueryDto {
  @IsNotEmpty()
  @IsNumber()
  readonly date: number;

  @IsNotEmpty()
  @IsString()
  readonly diet_id: string;
}
