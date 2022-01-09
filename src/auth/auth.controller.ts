import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { SigninUserDto } from 'src/auth/dto/signin-user.dto';
import { SignupUserDto } from 'src/auth/dto/signup-user.dto';
import { VerifyAuthMailTokenDto } from 'src/auth/dto/verify-auth-mail-token.dto';
import { MailService } from 'src/mail/mail.service';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
  ) {}

  @Get('/mail')
  async verifyAuthMailToken(
    @Query() dto: VerifyAuthMailTokenDto,
    @Res() res: Response,
  ): Promise<void> {
    const user = await this.usersService.findUser(dto.e_mail);
    const userInfo = this.usersService.translateToResData(user);
    let isVerifyMail: boolean;

    userInfo.isVerifyMailToken
      ? (isVerifyMail = false)
      : (isVerifyMail = await this.authService.verifyAuthMailToken(dto));

    if (!isVerifyMail) return res.redirect(this.config.get('FAILED_URL'));

    userInfo.isVerifyMailToken = true;
    const { refreshToken, refreshSecret } =
      this.authService.generateRefreshTokenAndSecret(userInfo);

    this.authService.updateRefreshToken(
      dto.e_mail,
      refreshToken,
      refreshSecret,
    );

    return res.redirect(this.config.get('SUCCESS_URL'));
  }

  @Post('/signup')
  async signUp(@Body() dto: SignupUserDto): Promise<object> {
    const authMailToken = this.authService.generateAuthMailToken();
    const user = await this.authService.createUser(dto);

    await this.authService.createCertificate(user.e_mail, authMailToken);
    await this.mailService.sendAuthMailToken(dto.e_mail, authMailToken);

    return { message: 'success', data: null };
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() dto: SigninUserDto,
    @Res() res: Response,
  ): Promise<object> {
    const user = await this.usersService.findUser(dto.e_mail);
    if (!user.isVerifyMailToken)
      throw new ForbiddenException('You must authenticate mail');
    else if (!this.authService.validatePassword(dto.password, user.password))
      throw new UnauthorizedException(`The password doesn't match`);

    const userInfo = this.usersService.translateToResData(user);
    const accessToken = this.authService.generateAccessToken(userInfo);
    this.authService.sendAccessToken(res, accessToken);

    return res.send({ message: 'success', data: userInfo });
  }

  @Get('/refresh/:e_mail')
  async getAccessToken(
    @Param('e_mail') e_mail: string,
    @Res() res: Response,
  ): Promise<object> {
    const certificate = await this.authService.findCertificate(e_mail);
    let accessToken: string;
    const tokenData = this.authService.verifyJwtToken(
      certificate.refreshToken,
      certificate.refreshSecret,
    );

    if (!tokenData) {
      const user = await this.usersService.findUser(e_mail);
      const userInfo = this.usersService.translateToResData(user);
      const { refreshToken, refreshSecret } =
        this.authService.generateRefreshTokenAndSecret(userInfo);

      await this.authService.updateRefreshToken(
        e_mail,
        refreshToken,
        refreshSecret,
      );
      accessToken = this.authService.generateAccessToken(userInfo);
    } else {
      const userInfo = this.usersService.translateToResData(tokenData);
      accessToken = this.authService.generateAccessToken(userInfo);
    }
    res.clearCookie('accessToken');
    this.authService.sendAccessToken(res, accessToken);

    return res.send({ message: 'success', data: null });
  }

  @Get('/oauth')
  oauth() {
    return;
  }
}
