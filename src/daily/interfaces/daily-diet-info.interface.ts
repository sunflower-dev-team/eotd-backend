import { IntersectionType } from '@nestjs/swagger';
import { CreateDailyDietDto } from '../dto/create-daily-diet.dto';

export class DailyDietInfo extends IntersectionType(
  CreateDailyDietDto,
  class {
    diet_id: string;
  },
) {}
