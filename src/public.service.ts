import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { JWTTokenData } from 'src/auth/interfaces/jwt-token-data.interface';
import { UserInfo } from 'src/user/interfaces/user-info.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PublicService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findUser(e_mail: string): Promise<User> {
    const user: User | null = await this.userModel
      .findOne({ e_mail })
      .select({ _id: 0 });

    if (!user) throw new NotFoundException('No exist user');
    return JSON.parse(JSON.stringify(user));
  }

  isSamePassword(plainPassword: string, encryptedPassword: string): boolean {
    return bcrypt.compareSync(plainPassword, encryptedPassword);
  }

  getCurrentDate(): number {
    const date = new Date(Date.now());
    const year = date.getFullYear().toString();
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();

    month.length === 1 ? (month = 0 + month) : '';
    day.length === 1 ? (day = 0 + day) : '';

    return Number(year + month + day);
  }

  translateToResUserInfo(userInfo: User | JWTTokenData): UserInfo {
    const {
      e_mail,
      name,
      gender,
      birth,
      isVerifyMailToken,
      kakao_oauth,
      admin,
    } = userInfo;

    return {
      e_mail,
      name,
      gender,
      birth,
      isVerifyMailToken,
      kakao_oauth,
      admin,
    };
  }
}