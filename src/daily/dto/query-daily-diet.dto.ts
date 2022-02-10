import {
  ApiProperty,
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

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

export class DeleteDailyDietQueryDto extends IntersectionType(
  OmitType(UpdateDailyDietQueryDto, ['diet_id'] as const),
  PartialType(PickType(UpdateDailyDietQueryDto, ['diet_id'] as const)),
) {}
