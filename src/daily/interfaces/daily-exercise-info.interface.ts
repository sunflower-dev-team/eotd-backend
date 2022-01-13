import { IntersectionType } from '@nestjs/swagger';
import { CreateDailyExerciseDto } from '../dto/create-daily-exercise.dto';

export class DailyExerciseInfo extends IntersectionType(
  CreateDailyExerciseDto,
  class {
    exercise_id: string;
  },
) {}
