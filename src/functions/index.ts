import { JWTTokenData } from 'src/auth/interfaces/jwt-token-data.interface';
import { User } from 'src/schemas/user.schema';
import { UserInfo } from 'src/users/interfaces/user-info.interface';

export const getCurrentDate = (): number => {
  const date = new Date(Date.now());
  const year = date.getFullYear().toString();
  let month = (date.getMonth() + 1).toString();
  let day = date.getDate().toString();
  month.length === 1 ? (month = 0 + month) : '';
  day.length === 1 ? (day = 0 + day) : '';
  return Number(year + month + day);
};

export const translateToResData = (userInfo: User | JWTTokenData): UserInfo => {
  const { e_mail, name, gender, birth, isVerifyMailToken, kakao_oauth, admin } =
    userInfo;

  return {
    e_mail,
    name,
    gender,
    birth,
    isVerifyMailToken,
    kakao_oauth,
    admin,
  };
};
