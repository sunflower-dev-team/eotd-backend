import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignupUserDto } from 'src/dto/signup-user.dto';
import { User, UserDocument } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { VerifyAuthMailToken } from 'src/dto/verify-auth-mail-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private usersModel: Model<UserDocument>,
  ) {}

  generateAuthMailToken(): string {
    const salt: string = bcrypt.genSaltSync();
    const authMailToken: string = bcrypt.hashSync(uuid.v4(), salt);
    return authMailToken;
  }

  async verifyAuthMailToken(dto: VerifyAuthMailToken): Promise<boolean> {
    const { e_mail, authMailToken }: VerifyAuthMailToken = dto;
    const user: User | boolean = await this.usersModel
      .findOne({
        e_mail,
      })
      .catch((err) => {
        console.log(err);
        return false;
      });

    if (!user) return false;
    else if (user.isVerifyMailToken) return false;
    if (authMailToken !== user.authMailToken) return false;
    await this.usersModel
      .updateOne({ e_mail }, { isVerifyMailToken: true })
      .catch((err) => {
        console.log(err);
        return false;
      });
    return true;
  }

  generateAccessToken() {
    return;
  }

  sendAccessToken() {
    return;
  }

  verifyAccessToken() {
    return;
  }

  generateRefreshToken() {
    return;
  }

  sendRefreshToken() {
    return;
  }

  verifyRefreshToken() {
    return;
  }

  async signup(userInfo: SignupUserDto, authMailToken: string): Promise<User> {
    const salt: string = bcrypt.genSaltSync();
    const password: string = bcrypt.hashSync(userInfo.password, salt);

    const createdUser: User | null = await this.usersModel
      .create({
        ...userInfo,
        password,
        authMailToken,
      })
      .catch((err) => {
        console.log(err);
        return null;
      });
    return createdUser;
  }

  signin() {
    return;
  }
}
