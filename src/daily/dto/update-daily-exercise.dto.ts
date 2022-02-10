import { PickType } from '@nestjs/swagger';
import { CreateDailyExerciseDto } from './create-daily-exercise.dto';

export class UpdateDailyExerciseBodyDto extends PickType(
  CreateDailyExerciseDto,
  ['set'] as const,
) {}
