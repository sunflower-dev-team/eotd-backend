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

  async sendAuthMailToken(
    e_mail: string,
    authMailToken: string,
  ): Promise<void> {
    const ROOT_URL = this.config.get('ROOT_URL');
    const PORT = this.config.get('PORT');
    const url = `${ROOT_URL}:${PORT}/auth/mail?e_mail=${e_mail}&authMailToken=${authMailToken}`;

    await this.mailerService
      .sendMail({
        to: e_mail,
        subject: '[EOTD] 회원가입 안내',
        template: './confirmation',
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
