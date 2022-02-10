import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTTokenData } from 'src/auth/interfaces/jwt-token-data.interface';
import { PublicService } from 'src/public.service';
import { UserInfo } from 'src/user/interfaces/user-info.interface';

@Injectable()
export class JWTAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    private readonly config: ConfigService,
    private readonly publicService: PublicService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const accessToken: string = req?.cookies?.accessToken;
          if (!accessToken) {
            const swaggerToken: any = req?.headers?.accesstoken;
            if (!swaggerToken)
              throw new UnauthorizedException(`Not found accessToken`);
            return swaggerToken;
          }
          return accessToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: JWTTokenData): Promise<UserInfo> {
    return this.publicService.translateToResUserInfo(payload);
  }
}
