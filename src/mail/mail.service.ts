import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as uuid from 'uuid';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private config: ConfigService,
  ) {}

  generateAuthMailToken(): string {
    const authMailToken: string = uuid.v4();
    return authMailToken;
  }

  async sendAuthMailTokenForSignup(
    e_mail: string,
    authMailToken: string,
  ): Promise<void> {
    const ROOT_URL = this.config.get('ROOT_URL');
    const PORT = this.config.get('PORT');
    const url = `${ROOT_URL}:${PORT}/auth/mail-signup?e_mail=${e_mail}&authMailToken=${authMailToken}`;

    await this.mailerService
      .sendMail({
        to: e_mail,
        subject: '[EOTD] 회원가입 안내',
        template: './signup',
        context: {
          url,
        },
      })
      .catch(() => {
        throw new InternalServerErrorException('The mail has not been sent');
      });
    return;
  }

  async sendAuthMailTokenForFindPassword(
    e_mail: string,
    authMailToken: string,
  ): Promise<void> {
    const ROOT_URL = this.config.get('ROOT_URL');
    const PORT = this.config.get('PORT');
    const url = `${ROOT_URL}:${PORT}/auth/mail-password?e_mail=${e_mail}&authMailToken=${authMailToken}`;

    await this.mailerService
      .sendMail({
        to: e_mail,
        subject: '[EOTD] 비밀번호 찾기 안내',
        template: './find-password',
        context: {
          url,
        },
      })
      .catch(() => {
        throw new InternalServerErrorException('The mail has not been sent');
      });
    return;
  }
}
