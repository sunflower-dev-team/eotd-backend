export interface JWTTokenData {
  e_mail: string;
  name: string;
  gender: string;
  birth: number;
  isVerifyMailToken: boolean;
  kakao_oauth: boolean;
  admin: boolean;
  iat: number;
  exp: number;
}
