import { PartialType } from '@nestjs/swagger';
import { CreateDailyRoutineDto } from './create-daily-routine.dto';

export class UpdateDailyRoutineBodyDto extends PartialType(
  CreateDailyRoutineDto,
) {}
