import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UserDetail, UserDetailSchema } from 'src/schemas/user-detail.schema';
import { Daily, DailySchema } from 'src/schemas/daily.schema';
import { AuthModule } from 'src/auth/auth.module';
import { MailModule } from 'src/mail/mail.module';
import { DailyModule } from 'src/daily/daily.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PublicService } from 'src/public.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserDetail.name, schema: UserDetailSchema },
      { name: Daily.name, schema: DailySchema },
    ]),
    AuthModule,
    MailModule,
    DailyModule,
  ],
  controllers: [UserController],
  providers: [UserService, PublicService],
})
export class UserModule {}
