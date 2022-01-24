import { Module } from '@nestjs/common';
import { DailyService } from './daily.service';
import { DailyController } from './daily.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Daily, DailySchema } from 'src/schemas/daily.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { PublicService } from 'src/public.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Daily.name, schema: DailySchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [DailyService, PublicService],
  controllers: [DailyController],
  exports: [DailyService],
})
export class DailyModule {}
