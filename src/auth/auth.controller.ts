import {
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
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
import { VerifyAuthMailToken } from 'src/auth/dto/verify-auth-mail-token.dto';
import { JWTTokenData } from 'src/interfaces/jwt-token-data.interface';
import { UserInfo } from 'src/interfaces/user-info.interface';
import { MailService } from 'src/mail/mail.service';
import { Certificate } from 'src/schemas/certificate.schema';
import { User } from 'src/schemas/user.schema';
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
    @Query() dto: VerifyAuthMailToken,
    @Res() res: Response,
  ): Promise<void> {
    const isVerifyMailToken: boolean =
      await this.authService.verifyAuthMailToken(dto);

    if (isVerifyMailToken) {
      const user: User = await this.usersService.findUser(dto.e_mail);
      const userInfo: UserInfo = this.usersService.translateToResData(user);
      const { refreshToken, refreshSecret } =
        this.authService.generateRefreshTokenAndSecret(userInfo);
      this.authService.updateRefreshToken(
        dto.e_mail,
        refreshToken,
        refreshSecret,
      );
      return res.redirect(this.config.get('SUCCESS_URL'));
    }
    return res.redirect(this.config.get('FAILED_URL'));
  }

  @Post('/signup')
  async signUp(@Body() dto: SignupUserDto): Promise<object> {
    const authMailToken: string = this.authService.generateAuthMailToken();

    const user: User | null = await this.authService.createUser(dto);
    if (!user) throw new ConflictException(`Existing e_mail : ${dto.e_mail}`);

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
    const user: User | null = await this.usersService.findUser(dto.e_mail);
    if (!user) throw new NotFoundException('No exist user');
    else if (!user.isVerifyMailToken)
      throw new ForbiddenException('You must authenticate mail');
    else if (!this.authService.validatePassword(dto.password, user.password))
      throw new UnauthorizedException(`The password doesn't match`);

    const userInfo: UserInfo = this.usersService.translateToResData(user);

    const accessToken: string = this.authService.generateAccessToken(userInfo);
    this.authService.sendAccessToken(res, accessToken);

    return res.send({ message: 'success', data: userInfo });
  }

  @Get('/refresh/:e_mail')
  async getAccessToken(
    @Param('e_mail') e_mail: string,
    @Res() res: Response,
  ): Promise<object> {
    const authInfo: Certificate = await this.authService.findAuthData(e_mail);
    if (!authInfo) throw new NotFoundException('No exist user');

    let accessToken: any;
    const tokenData: JWTTokenData | null = this.authService.verifyJwtToken(
      authInfo.refreshToken,
      authInfo.refreshSecret,
    );

    if (!tokenData) {
      const user: User = await this.usersService.findUser(e_mail);
      const userInfo: UserInfo = this.usersService.translateToResData(user);
      const { refreshToken, refreshSecret } =
        this.authService.generateRefreshTokenAndSecret(userInfo);
      await this.authService.updateRefreshToken(
        e_mail,
        refreshToken,
        refreshSecret,
      );
      accessToken = this.authService.generateAccessToken(userInfo);
    } else {
      const userInfo: UserInfo =
        this.usersService.translateToResData(tokenData);
      accessToken = this.authService.generateAccessToken(userInfo);
    }

    res.clearCookie('accessToken');
    this.authService.sendAccessToken(res, accessToken);
    return res.send({ message: 'success', data: null });
  }

  @Get('/test')
  @UseGuards(AuthGuard('jwt'))
  async test() {
    return;
  }

  @Get('/oauth')
  oauth() {
    return;
  }
}
