import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { UserInfo } from 'src/users/interfaces/user-info.interface';
import { JWTTokenData } from 'src/auth/interfaces/jwt-token-data.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findUser(e_mail: string): Promise<User> {
    const user: User | null = await this.userModel
      .findOne({ e_mail })
      .select({ _id: 0 });

    if (!user) throw new NotFoundException('No exist user');
    return JSON.parse(JSON.stringify(user));
  }

  translateToResData(userInfo: User | JWTTokenData): UserInfo {
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
