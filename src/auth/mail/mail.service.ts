import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { CreateUserDto } from 'src/dto/create-user.dto';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private config: ConfigService,
  ) {}

  async sendMail(userInfo: CreateUserDto): Promise<void> {
    const pwdSalt: string = bcrypt.genSaltSync();
    const password: string = bcrypt.hashSync(userInfo.password, pwdSalt);
    const e_mailSalt: string = bcrypt.genSaltSync();
    const token = sign({ ...userInfo, password }, e_mailSalt, {
      expiresIn: '1d',
    });
    const url = `${this.config.get('ROOT_URL')}:${this.config.get(
      'PORT',
    )}/users/signup?m=checkMailToken&token=${token}&secret=${e_mailSalt}`;

    await this.mailerService
      .sendMail({
        to: userInfo.e_mail,
        subject: '[EOTD] 회원가입 안내',
        template: './confirmation',
        context: {
          url,
        },
      })
      .catch((err) => {
        throw err;
      });
    return;
  }
}
