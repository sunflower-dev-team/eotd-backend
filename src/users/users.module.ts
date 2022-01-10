import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Daily, DailySchema } from 'src/schemas/daily.schema';
import { UserDetail, UserDetailSchema } from 'src/schemas/user-detail.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserDetail.name, schema: UserDetailSchema },
      { name: Daily.name, schema: DailySchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
