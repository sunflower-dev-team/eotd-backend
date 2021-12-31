import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private config: ConfigService,
  ) {}

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
      .catch((err) => {
        throw err;
      });
    return;
  }
}
