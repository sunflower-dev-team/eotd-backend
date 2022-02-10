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
  ApiResponse,
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
  async signup(@Body() dto: CreateUserDto): Promise<object> {
    const authMailToken = this.mailService.generateAuthMailToken();
    const user = await this.userService.createUser(dto);
    await this.authService.createCertificate(user._id, authMailToken);
    await this.mailService.sendAuthMailTokenForSignup(
      user._id,
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
  @ApiOkResponse(api.success.basicUser)
  @ApiBadRequestResponse(api.badRequest)
  @ApiUnauthorizedResponse(api.unauthorized.password)
  @ApiForbiddenResponse(api.forbidden.mail)
  @ApiNotFoundResponse(api.notFound.user)
  @HttpCode(HttpStatus.OK)
  async signin(
    @Body() dto: SigninUserDto,
    @Res() res: Response,
  ): Promise<object> {
    const user = await this.publicService.findUserByEmail(dto.e_mail);
    if (!user.isAuthorized)
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
      '유저의 정보 수정 - [패스워드를 바꿀 경우, 인증 API의 패스워드 일치 확인을 해야합니다]',
    description: `유저의 정보를 수정하는 API입니다.`,
  })
  @ApiCookieAuth()
  @ApiOkResponse(api.success.basicUser)
  @ApiResponse(api.success.kakaoUser)
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
    const { _id }: any = req.user;
    const user = await this.userService.updateUser(_id, dto);
    const userInfo = this.publicService.translateToResUserInfo(user);
    const accessToken = this.authService.generateAccessToken(userInfo);
    const { refreshToken, refreshSecret } =
      this.authService.generateRefreshTokenAndSecret(userInfo);

    this.authService.updateRefreshToken(_id, refreshToken, refreshSecret);
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
    const { _id }: any = req.user;
    await this.publicService.findUserBy_id(_id);

    await Promise.all([
      this.userService.deleteUser(_id),
      this.userService.deleteUserDetail(_id).catch(() => {
        return;
      }),
      this.authService.deleteCertificate(_id),
      this.dailyService.deleteDailys(_id),
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
    const { _id }: any = req.user;
    const userDetail = await this.userService.findUserDetail(_id);
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
    const { _id }: any = req.user;
    await this.userService.createUserDetail(_id, dto);
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
    const { _id }: any = req.user;
    await this.userService.updateUserDetail(_id, dto);
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
    const user = await this.publicService.findUserByEmail(e_mail);
    const authMailToken = this.mailService.generateAuthMailToken();

    await this.authService.updateAuthMailToken(user._id, authMailToken);
    await this.mailService.sendAuthMailTokenForFindPassword(
      user._id,
      e_mail,
      authMailToken,
    );

    return { message: 'success', data: null };
  }

  @Get('/:e_mail')
  @ApiOperation({
    summary: '중복이메일 유효성 검사',
    description: `해당 이메일을 가진 유저의 정보를 가져오는 API입니다.`,
  })
  @ApiParam({ name: 'e_mail', description: '이메일', required: true })
  @ApiOkResponse(api.success.basicUser)
  @ApiResponse(api.success.kakaoUser)
  @ApiNotFoundResponse(api.notFound.user)
  async validateEmail(@Param('e_mail') e_mail: string): Promise<object> {
    const user = await this.publicService.findUserByEmail(e_mail);
    const userInfo = this.publicService.translateToResUserInfo(user);

    return { message: 'success', data: userInfo };
  }
}
