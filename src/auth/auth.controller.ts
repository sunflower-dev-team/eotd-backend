import {
  Body,
  Controller,
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
import { VerifyAuthMailTokenDto } from 'src/auth/dto/verify-auth-mail-token.dto';
import { AuthService } from './auth.service';
import { ValidatePasswordDto } from './dto/validate-password.dto';
import { VerifyMailGuard } from './guards/verify-mail.guard';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiDefaultResponse,
  ApiForbiddenResponse,
  ApiCookieAuth,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { api } from 'src/swagger';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { PublicService } from 'src/public.service';
import { CustomizedExerciseService } from 'src/customized-exercise/customized-exercise.service';
import { DailyService } from 'src/daily/daily.service';

@Controller('auth')
@ApiTags('인증 API')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly dailyService: DailyService,
    private readonly customizedExerciseService: CustomizedExerciseService,
    private readonly config: ConfigService,
    private readonly publicService: PublicService,
  ) {}

  @Get('/mail-signup')
  @ApiOperation({
    summary: '회원가입 메일 인증 [클라이언트 접근 X]',
    description: `회원가입 후 인증메일이 전송되었을 때, 유저의 메일에서 인증버튼을 누를시 유효성검사를 진행하는 API입니다.`,
  })
  @ApiDefaultResponse({
    description: `
    \n인증시 성공페이지(인증이 완료되었습니다)로 리다이렉트합니다.
    \n실패시 실패페이지(유효하지 않은 페이지입니다)로 리다이렉트합니다.
    `,
  })
  @ApiBadRequestResponse(api.badRequest)
  async verifySignupMailToken(
    @Query() dto: VerifyAuthMailTokenDto,
    @Res() res: Response,
  ): Promise<void> {
    const user = await this.publicService.findUserBy_id(dto._id);
    const userInfo = this.publicService.translateToResUserInfo(user);
    let isVerifyMail: boolean;

    userInfo.isAuthorized
      ? (isVerifyMail = false)
      : (isVerifyMail = await this.authService.isVerifyAuthMailToken(dto));

    if (!isVerifyMail) return res.redirect(this.config.get('FAILED_URL'));

    userInfo.isAuthorized = true;
    const { refreshToken, refreshSecret } =
      this.authService.generateRefreshTokenAndSecret(userInfo);
    this.authService.updateRefreshToken(user._id, refreshToken, refreshSecret);

    await this.dailyService.createDaily(user._id);
    await this.customizedExerciseService.createCustomizedExerciseForm(user._id);

    return res.redirect(this.config.get('SUCCESS_SIGNUP_URL'));
  }

  @Get('/mail-password')
  @ApiOperation({
    summary: '비밀번호 찾기 메일 인증 [클라이언트 접근 X]',
    description: `비밀번호 찾기 인증메일이 전송되었을 때
    \n유저의 메일에서 "임시 비밀번호 발급받기" 버튼을 누를시 유효성검사를 진행하는 API입니다.`,
  })
  @ApiDefaultResponse({
    description: `
    \n인증시 성공페이지(임시 비밀번호 재발급 페이지)로 리다이렉트합니다.
    \n실패시 실패페이지(유효하지 않은 페이지입니다)로 리다이렉트합니다.
    `,
  })
  @ApiBadRequestResponse(api.badRequest)
  async verifyPasswordMailToken(
    @Query() dto: VerifyAuthMailTokenDto,
    @Res() res: Response,
  ): Promise<void> {
    const isVerifyMail: boolean = await this.authService.isVerifyAuthMailToken(
      dto,
    );

    if (!isVerifyMail) return res.redirect(this.config.get('FAILED_URL'));

    const { temporaryPassword, user } =
      await this.authService.getTemporaryPassword(dto._id);
    const userInfo = this.publicService.translateToResUserInfo(user);
    const { refreshToken, refreshSecret } =
      this.authService.generateRefreshTokenAndSecret(userInfo);
    await this.authService.updateRefreshToken(
      dto._id,
      refreshToken,
      refreshSecret,
    );

    return res.redirect(
      this.config.get('SUCCESS_PASSWORD_URL') + '/' + temporaryPassword,
    );
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
    const { _id }: any = req.user;
    const certificate = await this.authService.findCertificate(_id);
    let accessToken: string;
    const tokenData = this.authService.verifyJwtToken(
      certificate.refreshToken,
      certificate.refreshSecret,
    );

    if (!tokenData) {
      const user = await this.publicService.findUserBy_id(_id);
      const userInfo = this.publicService.translateToResUserInfo(user);
      const { refreshToken, refreshSecret } =
        this.authService.generateRefreshTokenAndSecret(userInfo);

      await this.authService.updateRefreshToken(
        _id,
        refreshToken,
        refreshSecret,
      );
      accessToken = this.authService.generateAccessToken(userInfo);
    } else {
      const userInfo = this.publicService.translateToResUserInfo(tokenData);
      accessToken = this.authService.generateAccessToken(userInfo);
    }
    this.authService.removeAccessToken(res);
    this.authService.sendAccessToken(res, accessToken);

    return res.send({ message: 'success', data: null });
  }

  @Post('/password')
  @ApiOperation({
    summary: '패스워드 일치 확인 - [비밀번호 변경] 접근 시 인증',
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
    const { _id }: any = req.user;
    const user = await this.publicService.findUserBy_id(_id);

    if (!this.publicService.isSamePassword(dto.password, user.password))
      throw new UnauthorizedException(`The password doesn't match`);
    return { message: 'success', data: null };
  }
}
