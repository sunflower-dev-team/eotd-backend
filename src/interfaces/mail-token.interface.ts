import { JwtPayload } from 'jsonwebtoken';

export interface MailToken {
  name: string | JwtPayload;
  gender: string | JwtPayload;
  birth: number | JwtPayload;
  e_mail: string | JwtPayload;
  password: string | JwtPayload;
  iat: number | JwtPayload;
  exp: number | JwtPayload;
}
