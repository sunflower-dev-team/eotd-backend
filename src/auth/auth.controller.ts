import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { SigninUserDto } from 'src/auth/dto/signin-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { VerifyAuthMailTokenDto } from 'src/auth/dto/verify-auth-mail-token.dto';
import { DailyService } from 'src/daily/daily.service';
import { translateToResData } from 'src/functions';
import { MailService } from 'src/mail/mail.service';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { ValidatePasswordDto } from './dto/validate-password.dto';
import { VerifyMailGuard } from './guards/verify-mail.guard';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiDefaultResponse,
  ApiForbiddenResponse,
  ApiCookieAuth,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { api } from 'src/swagger';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@Controller('auth')
@ApiTags('인증 API')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
    private readonly dailyService: DailyService,
    private readonly config: ConfigService,
  ) {}

  @Get('/mail')
  @ApiOperation({
    summary: '메일 인증',
    description: `회원가입 후 인증메일이 전송되었을 때, 유저의 메일에서 인증버튼을 누를시 유효성검사를 진행하는 API입니다.`,
  })
  @ApiDefaultResponse({
    description: `
    \n인증시 성공페이지(인증이 완료되었습니다)로 리다이렉트합니다.
    \n실패시 실패페이지(유효하지 않은 페이지입니다)로 리다이렉트합니다.
    `,
  })
  @ApiBadRequestResponse(api.badRequest)
  async verifyAuthMailToken(
    @Query() dto: VerifyAuthMailTokenDto,
    @Res() res: Response,
  ): Promise<void> {
    const user = await this.usersService.findUser(dto.e_mail);
    const userInfo = translateToResData(user);
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

  @Get('/refresh')
  @ApiOperation({
    summary: 'Access-Token 재발급',
    description: `Access-Token을 재발급 받기 위한 API입니다.
    \n응답 성공시 재발급 받은 accessToken이 쿠키에 담깁니다.`,
  })
  @ApiCookieAuth()
  @ApiOkResponse(api.success.nulldata)
  @ApiNotFoundResponse(api.notFound.user)
  @UseGuards(RefreshTokenGuard)
  async getAccessToken(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<object> {
    const { e_mail }: any = req.user;
    const certificate = await this.authService.findCertificate(e_mail);
    let accessToken: string;
    const tokenData = this.authService.verifyJwtToken(
      certificate.refreshToken,
      certificate.refreshSecret,
    );

    if (!tokenData) {
      const user = await this.usersService.findUser(e_mail);
      const userInfo = translateToResData(user);
      const { refreshToken, refreshSecret } =
        this.authService.generateRefreshTokenAndSecret(userInfo);

      await this.authService.updateRefreshToken(
        e_mail,
        refreshToken,
        refreshSecret,
      );
      accessToken = this.authService.generateAccessToken(userInfo);
    } else {
      const userInfo = translateToResData(tokenData);
      accessToken = this.authService.generateAccessToken(userInfo);
    }
    this.authService.removeAccessToken(res);
    this.authService.sendAccessToken(res, accessToken);

    return res.send({ message: 'success', data: null });
  }

  @Get('/signout')
  @ApiOperation({
    summary: '로그아웃',
    description: `로그아웃을 위한 API입니다.
    \n응답 성공시 accessToken이 쿠키에서 제거됩니다.`,
  })
  @ApiCookieAuth()
  @ApiOkResponse(api.success.nulldata)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.mail)
  @UseGuards(VerifyMailGuard)
  signOut(@Res() res: Response): object {
    this.authService.removeAccessToken(res);
    return res.send({ message: 'success', data: null });
  }

  @Post('/password')
  @ApiOperation({
    summary: '패스워드 일치 확인 - [비밀번호 변경, 회원탈퇴] 접근 시 인증',
    description: `비밀번호 변경 API 및 회원탈퇴 API에 접근하기 전 인증해야할 API입니다.
      \n입력한 비밀번호가 유저의 비밀번호와 일치하는지 확인합니다.`,
  })
  @ApiCookieAuth()
  @ApiOkResponse(api.success.nulldata)
  @ApiBadRequestResponse(api.badRequest)
  @ApiUnauthorizedResponse(api.unauthorized.tokenAndPwd)
  @ApiForbiddenResponse(api.forbidden.mail)
  @ApiNotFoundResponse(api.notFound.user)
  @HttpCode(HttpStatus.OK)
  @UseGuards(VerifyMailGuard)
  async validatePassword(
    @Req() req: Request,
    @Body() dto: ValidatePasswordDto,
  ): Promise<object> {
    const { e_mail }: any = req.user;
    const user = await this.usersService.findUser(e_mail);
    const isSamePassword = this.authService.validatePassword(
      dto.password,
      user.password,
    );

    if (!isSamePassword)
      throw new UnauthorizedException(`The password doesn't match`);
    return { message: 'success', data: null };
  }

  @Post('/signup')
  @ApiOperation({
    summary: '회원가입',
    description: `회원가입을 위한 API입니다.
    \n유저가 가입되는 동시에 가입시 기입한 이메일로 인증메일이 발송 됩니다.`,
  })
  @ApiCreatedResponse(api.success.nulldata)
  @ApiBadRequestResponse(api.badRequest)
  @ApiConflictResponse(api.conflict.e_mail)
  async signUp(@Body() dto: CreateUserDto): Promise<object> {
    const authMailToken = this.authService.generateAuthMailToken();

    await this.usersService.createUser(dto);
    await this.authService.createCertificate(dto.e_mail, authMailToken);
    await this.mailService.sendAuthMailToken(dto.e_mail, authMailToken);

    return { message: 'success', data: null };
  }

  @Post('/signin')
  @ApiOperation({
    summary: '로그인',
    description: `로그인을 위한 API입니다.
    \n응답 성공시 accessToken이 쿠키에 담깁니다.`,
  })
  @ApiOkResponse(api.success.user)
  @ApiBadRequestResponse(api.badRequest)
  @ApiUnauthorizedResponse(api.unauthorized.password)
  @ApiForbiddenResponse(api.forbidden.mail)
  @ApiNotFoundResponse(api.notFound.user)
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

    const userInfo = translateToResData(user);
    const accessToken = this.authService.generateAccessToken(userInfo);
    this.authService.sendAccessToken(res, accessToken);

    return res.send({ message: 'success', data: userInfo });
  }

  @Delete('/withdrawal')
  @ApiOperation({
    summary: '회원탈퇴',
    description: `회원탈퇴를 위한 API입니다.
    \n응답 성공시 accessToken이 쿠키에서 제거되며, 유저의 정보가 삭제됩니다.`,
  })
  @ApiCookieAuth()
  @ApiOkResponse(api.success.nulldata)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.mail)
  @ApiNotFoundResponse(api.notFound.user)
  @UseGuards(VerifyMailGuard)
  async deleteUser(@Req() req: Request, @Res() res: Response): Promise<object> {
    const { e_mail }: any = req.user;
    await this.usersService.findUser(e_mail);

    await Promise.all([
      this.authService.deleteUser(e_mail),
      this.authService.deleteCertificate(e_mail),
      this.usersService.deleteOneUserDetail(e_mail).catch(() => {
        return;
      }),
      this.dailyService.deleteDaily(e_mail),
    ]);
    this.authService.removeAccessToken(res);

    return res.send({ message: 'success', data: null });
  }

  @Get('/oauth')
  @ApiCookieAuth()
  @UseGuards(VerifyMailGuard)
  oauth(@Req() req: Request) {
    console.log(req);
    return;
  }
}
