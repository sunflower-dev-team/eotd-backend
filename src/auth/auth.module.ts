import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { DailyModule } from 'src/daily/daily.module';
import { MailModule } from 'src/mail/mail.module';
import { Certificate, CertificateSchema } from 'src/schemas/certificate.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JWTStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Certificate.name, schema: CertificateSchema },
    ]),
    UsersModule,
    MailModule,
    DailyModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy],
  exports: [PassportModule, JWTStrategy],
})
export class AuthModule {}
