import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { CustomizedExerciseModule } from 'src/customized-exercise/customized-exercise.module';
import { DailyModule } from 'src/daily/daily.module';
import { PublicService } from 'src/public.service';
import { Certificate, CertificateSchema } from 'src/schemas/certificate.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JWTAccessStrategy } from './strategies/jwt-access.strategy';
import { JWTRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Certificate.name, schema: CertificateSchema },
    ]),
    DailyModule,
    CustomizedExerciseModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JWTAccessStrategy,
    JWTRefreshStrategy,
    PublicService,
  ],
  exports: [PassportModule, JWTAccessStrategy, JWTRefreshStrategy, AuthService],
})
export class AuthModule {}
