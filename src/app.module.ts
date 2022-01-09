import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { DailyModule } from './daily/daily.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env.dev', isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get('DB_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    DailyModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
