import { PartialType, PickType } from '@nestjs/swagger';
import { CreateExerciseDto } from './create-exercise.dto';

export class FindExerciseDto extends PartialType(
  PickType(CreateExerciseDto, ['exercise_name', 'target'] as const),
) {}
