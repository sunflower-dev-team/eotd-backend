import { PartialType } from '@nestjs/swagger';
import { CreateDailyDietDto } from './create-daily-diet.dto';

export class UpdateDailyDietBodyDto extends PartialType(CreateDailyDietDto) {}
