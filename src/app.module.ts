import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { DailyModule } from './daily/daily.module';
import { ExerciseModule } from './exercise/exercise.module';
import { CustomizedExerciseModule } from './customized-exercise/customized-exercise.module';
import { CommandModule } from 'nestjs-command';
import { ExerciseCommand } from './exercise/exercise.command';

@Module({
  imports: [
    CommandModule,
    ConfigModule.forRoot({ envFilePath: '.env.development', isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get('DB_URI'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    DailyModule,
    ExerciseModule,
    CustomizedExerciseModule,
  ],
  controllers: [AppController],
  providers: [ExerciseCommand],
})
export class AppModule {}
