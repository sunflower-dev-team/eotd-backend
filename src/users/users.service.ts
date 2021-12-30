import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { MailService } from 'src/auth/mail/mail.service';
import { verify, JwtPayload } from 'jsonwebtoken';
import { MailToken } from 'src/interfaces/mail-token.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private mailService: MailService,
  ) {}

  async checkSameEmail(e_mail: any): Promise<boolean> {
    const sameEmail: User = await this.userModel.findOne({ e_mail });
    return sameEmail ? true : false;
  }

  async sendMail(userInfo: CreateUserDto): Promise<void> {
    await this.mailService.sendMail(userInfo);
    return;
  }

  checkMailToken(token: string, secret: string): any | JwtPayload {
    try {
      return verify(token, secret);
    } catch {
      return null;
    }
  }

  async create(userInfo: MailToken): Promise<void> {
    delete userInfo.iat;
    delete userInfo.exp;
    await this.userModel.create(userInfo);
    return;
  }
}
