import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { SignupUserDto } from 'src/dto/signup-user.dto';
import { VerifyAuthMailToken } from 'src/dto/verify-auth-mail-token.dto';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/schemas/user.schema';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  @Get('/mail')
  async verifyAuthMailToken(
    @Query() dto: VerifyAuthMailToken,
  ): Promise<object> {
    const isVerifyMailToken = await this.authService.verifyAuthMailToken(dto);
    if (isVerifyMailToken) return { message: 'success', data: null }; // 성공페이지 클라이언트
    return { message: 'failure', data: null }; // 실패페이지 클라이언트
  }

  @Post('/signup')
  async signup(@Body() dto: SignupUserDto): Promise<object> {
    const authMailToken: string = this.authService.generateAuthMailToken();
    const user: User = await this.authService.signup(dto, authMailToken);
    if (!user) throw new ConflictException(`Existing e_mail : ${dto.e_mail}`);
    await this.mailService.sendAuthMailToken(dto.e_mail, authMailToken);
    return { message: 'success', data: null };
  }

  @Post('/signin')
  signin() {
    return;
  }

  @Get('/accessToken')
  verifyAccessToken() {
    return;
  }

  @Get('/refreshToken')
  verifyRefreshToken() {
    return;
  }

  @Get('/oauth')
  oauth() {
    return;
  }
}
