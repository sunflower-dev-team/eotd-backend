import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateExerciseDto } from './create-exercise.dto';

export class UpdateExerciseDto extends PartialType(
  OmitType(CreateExerciseDto, ['exercise_name'] as const),
) {}
