import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SignupUserDto } from 'src/dto/signup-user.dto';
import { VerifyAuthMailToken } from 'src/dto/verify-auth-mail-token.dto';
import { MailService } from 'src/mail/mail.service';
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
    // 회원 가입 => 메일 토큰 검증하는 컬럼 생성 ( 이 컬럼은 비밀번호 잃어 버렸을 때도 사용 )
    const authMailToken: string = this.authService.generateAuthMailToken();
    await this.authService.signup(dto, authMailToken);
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
