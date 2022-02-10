import {
  ApiProperty,
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateDailyExerciseQueryDto {
  @ApiProperty({ description: '날짜', example: 20220113 })
  @IsNotEmpty()
  @IsNumber()
  readonly date: number;

  @ApiProperty({
    description: '데일리 운동 루틴 ID',
    example: '06320d52-735a-40d1-a6cb-19e99932181c',
  })
  @IsNotEmpty()
  @IsString()
  readonly routine_id: string;

  @ApiProperty({
    description: '운동 이름',
    example: '벤치 프레스',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}

export class DeleteDailyExerciseQueryDto extends IntersectionType(
  OmitType(UpdateDailyExerciseQueryDto, ['name'] as const),
  PartialType(PickType(UpdateDailyExerciseQueryDto, ['name'] as const)),
) {}
