import {
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { UpdateDailyExerciseQueryDto } from './query-daily-exercise.dto';

export class UpdateDailyRoutineQueryDto extends OmitType(
  UpdateDailyExerciseQueryDto,
  ['name'] as const,
) {}

export class DeleteDailyRoutineQueryDto extends IntersectionType(
  OmitType(UpdateDailyRoutineQueryDto, ['routine_id'] as const),
  PartialType(PickType(UpdateDailyRoutineQueryDto, ['routine_id'] as const)),
) {}
