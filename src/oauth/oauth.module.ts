import { Module } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { OauthController } from './oauth.controller';
import { HttpModule } from '@nestjs/axios';
import { PublicService } from 'src/public.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { AuthModule } from 'src/auth/auth.module';
import { DailyModule } from 'src/daily/daily.module';
import { CustomizedExerciseModule } from 'src/customized-exercise/customized-exercise.module';

@Module({
  imports: [
    HttpModule.register({
      withCredentials: true,
      timeout: 5000,
      maxRedirects: 5,
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
    DailyModule,
    CustomizedExerciseModule,
  ],
  providers: [OauthService, PublicService],
  controllers: [OauthController],
  exports: [OauthService],
})
export class OauthModule {}
