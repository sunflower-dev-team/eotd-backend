import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTTokenData } from 'src/auth/interfaces/jwt-token-data.interface';
import { translateToResData } from 'src/functions';
import { UserInfo } from 'src/users/interfaces/user-info.interface';

@Injectable()
export class JWTRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly config: ConfigService) {
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
      ignoreExpiration: true,
      secretOrKey: config.get('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: JWTTokenData): Promise<UserInfo> {
    return translateToResData(payload);
  }
}
