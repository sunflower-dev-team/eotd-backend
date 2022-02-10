import { IntersectionType, OmitType } from '@nestjs/mapped-types';
import { User } from 'src/schemas/user.schema';

export class JWTTokenData extends IntersectionType(
  OmitType(User, ['password']),
  class {
    iat: number;
    exp: number;
  },
) {}
