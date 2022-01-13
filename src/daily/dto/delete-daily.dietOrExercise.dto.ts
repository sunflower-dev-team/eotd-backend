import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteDailyDietOrExerciseDto {
  @ApiProperty({ description: 'all 또는 diet_id', example: 'all' })
  @IsNotEmpty()
  @IsString()
  target: string;
}
