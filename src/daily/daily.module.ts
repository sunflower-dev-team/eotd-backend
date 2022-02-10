import { Module } from '@nestjs/common';
import { DailyService } from './daily.service';
import { DailyController } from './daily.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Dailys, DailysSchema } from 'src/schemas/daily.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { PublicService } from 'src/public.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Dailys.name, schema: DailysSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [DailyService, PublicService],
  controllers: [DailyController],
  exports: [DailyService],
})
export class DailyModule {}
