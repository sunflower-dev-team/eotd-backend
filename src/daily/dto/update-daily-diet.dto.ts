import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateDailyDietDto } from './create-daily-diet.dto';

export class UpdateDailyDietBodyDto extends PartialType(CreateDailyDietDto) {}

export class UpdateDailyDietQueryDto {
  @ApiProperty({ description: '날짜', example: 20220113 })
  @IsNotEmpty()
  @IsNumber()
  readonly date: number;

  @ApiProperty({
    description: '데일리 식단 ID',
    example: '06320d52-735a-40d1-a6cb-19e99932181c',
  })
  @IsNotEmpty()
  @IsString()
  readonly diet_id: string;
}
