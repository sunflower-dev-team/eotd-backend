import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { api } from 'src/swagger';
import {
  ApiTags,
  ApiParam,
  ApiCookieAuth,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { MailService } from 'src/mail/mail.service';
import { DailyService } from 'src/daily/daily.service';
import { PublicService } from 'src/public.service';
import { VerifyMailGuard } from 'src/auth/guards/verify-mail.guard';
import { CreateUserDetailDto } from './dto/create-user-detail.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserDetailDto } from './dto/update-user-detail.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninUserDto } from 'src/auth/dto/signin-user.dto';

@Controller('user')
@ApiTags('유저 API')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly dailyService: DailyService,
    private readonly publicService: PublicService,
  ) {}

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
    const authMailToken = this.mailService.generateAuthMailToken();
    await this.userService.createUser(dto);
    await this.authService.createCertificate(dto.e_mail, authMailToken);
    await this.mailService.sendAuthMailTokenForSignup(
      dto.e_mail,
      authMailToken,
    );

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
    const user = await this.publicService.findUser(dto.e_mail);
    if (!user.isVerifyMailToken)
      throw new ForbiddenException('You must authenticate mail');
    else if (!this.publicService.isSamePassword(dto.password, user.password))
      throw new UnauthorizedException(`The password doesn't match`);

    const userInfo = this.publicService.translateToResUserInfo(user);
    const accessToken = this.authService.generateAccessToken(userInfo);
    this.authService.sendAccessToken(res, accessToken);

    return res.send({ message: 'success', data: userInfo });
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

  @Patch('/info')
  @ApiOperation({
    summary:
      '유저의 정보 수정 - [유저의 정보 수정하기 전에 인증 API의 패스워드 일치 확인을 해야합니다]',
    description: `유저의 정보를 수정하는 API입니다.`,
  })
  @ApiCookieAuth()
  @ApiOkResponse(api.success.user)
  @ApiBadRequestResponse(api.badRequest)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.mail)
  @ApiNotFoundResponse(api.notFound.user)
  @UseGuards(VerifyMailGuard)
  async updateOneUserInfo(
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: UpdateUserDto,
  ): Promise<object> {
    const { e_mail }: any = req.user;
    const user = await this.userService.updateUser(e_mail, dto);
    const userInfo = this.publicService.translateToResUserInfo(user);
    const accessToken = this.authService.generateAccessToken(userInfo);
    const { refreshToken, refreshSecret } =
      this.authService.generateRefreshTokenAndSecret(userInfo);

    this.authService.updateRefreshToken(e_mail, refreshToken, refreshSecret);
    this.authService.removeAccessToken(res);
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
    await this.publicService.findUser(e_mail);

    await Promise.all([
      this.userService.deleteUser(e_mail),
      this.userService.deleteUserDetail(e_mail).catch(() => {
        return;
      }),
      this.authService.deleteCertificate(e_mail),
      this.dailyService.deleteDaily(e_mail),
    ]);
    this.authService.removeAccessToken(res);

    return res.send({ message: 'success', data: null });
  }

  @Get('/detail')
  @ApiOperation({
    summary: '유저의 디테일한 정보 조회',
    description: `유저의 디테일한 정보를 가져오는 API입니다.`,
  })
  @ApiCookieAuth()
  @ApiOkResponse(api.success.userDetail)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.mail)
  @ApiNotFoundResponse(api.notFound.detail)
  @UseGuards(VerifyMailGuard)
  async findOneUserDetail(@Req() req: Request): Promise<object> {
    const { e_mail }: any = req.user;
    const userDetail = await this.userService.findUserDetail(e_mail);
    return { message: 'success', data: userDetail };
  }

  @Post('/detail')
  @ApiOperation({
    summary: '유저의 디테일 생성',
    description: `유저의 디테일을 생성하는 API입니다.`,
  })
  @ApiCookieAuth()
  @ApiCreatedResponse(api.success.nulldata)
  @ApiBadRequestResponse(api.badRequest)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.mail)
  @ApiConflictResponse(api.conflict.detail)
  @UseGuards(VerifyMailGuard)
  async createUserDetail(
    @Req() req: Request,
    @Body() dto: CreateUserDetailDto,
  ): Promise<object> {
    const { e_mail }: any = req.user;
    await this.userService.createUserDetail(e_mail, dto);
    return { message: 'success', data: null };
  }

  @Patch('/detail')
  @ApiOperation({
    summary: '유저의 디테일한 정보 수정',
    description: `유저의 디테일한 정보를 수정하는 API입니다.`,
  })
  @ApiCookieAuth()
  @ApiOkResponse(api.success.nulldata)
  @ApiBadRequestResponse(api.badRequest)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.mail)
  @ApiNotFoundResponse(api.notFound.detail)
  @UseGuards(VerifyMailGuard)
  async updateUserDetail(
    @Req() req: Request,
    @Body() dto: UpdateUserDetailDto,
  ): Promise<object> {
    const { e_mail }: any = req.user;
    await this.userService.updateUserDetail(e_mail, dto);
    return { message: 'success', data: null };
  }

  @Get('/help/password/:e_mail')
  @ApiOperation({
    summary: '비밀번호 찾기',
    description: `유저의 이메일로 임시 비밀번호를 얻을 수 있는 링크를 전송하는 API입니다.`,
  })
  @ApiParam({ name: 'e_mail', description: '이메일', required: true })
  @ApiOkResponse(api.success.nulldata)
  @ApiNotFoundResponse(api.notFound.user)
  async findPassword(@Param('e_mail') e_mail: string): Promise<object> {
    await this.publicService.findUser(e_mail);
    const authMailToken = this.mailService.generateAuthMailToken();

    await this.authService.updateAuthMailToken(e_mail, authMailToken);
    await this.mailService.sendAuthMailTokenForFindPassword(
      e_mail,
      authMailToken,
    );

    return { message: 'success', data: null };
  }

  @Get('/:e_mail')
  @ApiOperation({
    summary: '특정한 유저의 정보 조회 - [중복이메일 유효성 검사]로도 사용 가능',
    description: `특정한 유저의 정보를 가져오는 API입니다.`,
  })
  @ApiParam({ name: 'e_mail', description: '이메일', required: true })
  @ApiOkResponse(api.success.user)
  @ApiNotFoundResponse(api.notFound.user)
  async validateEmail(@Param('e_mail') e_mail: string): Promise<object> {
    const user = await this.publicService.findUser(e_mail);
    const userInfo = this.publicService.translateToResUserInfo(user);

    return { message: 'success', data: userInfo };
  }

  // smm bfm pbf
  // 주간 통계 데이터

  // 주간 운동 데이터

  // 월 운동 데이터
}
