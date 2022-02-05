import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import {
  ApiTags,
  ApiParam,
  ApiResponse,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { PublicService } from 'src/public.service';
import { OauthCreateUserDto } from './dto/oauth-create-user.dto';
import { OauthService } from './oauth.service';
import { api } from 'src/swagger';
import { AuthService } from 'src/auth/auth.service';

@Controller('oauth')
@ApiTags('소셜 로그인 API')
export class OauthController {
  constructor(
    private readonly oauthService: OauthService,
    private readonly authService: AuthService,
    private readonly publicService: PublicService,
    private readonly config: ConfigService,
  ) {}

  @Get('/kakao/signin')
  @ApiOperation({
    summary: '카카오 소셜 로그인',
    description: `카카오 유저를 위한 소셜 로그인 API입니다.
    \n[EOTD에 가입된 유저]
    \ncode : 200 | message : suceess | data : 유저정보를 반환합니다.
    \n[EOTD에 가입되지 않은 유저]
    \ncode : 200 | message : failure | data : kakao_id와 카카오 동의 항목에서 체크한 데이터를 함께 반환합니다.`,
  })
  @ApiOkResponse(api.success.user)
  @ApiResponse(api.failure.oauth.kakao)
  getKakaoAuthorizationCode(@Res() res: Response) {
    const ROOT_URL = this.config.get('ROOT_URL');
    const PORT = this.config.get('PORT');
    const KAKAO_REST_API_KEY = this.config.get('KAKAO_REST_API_KEY');

    return res.redirect(
      `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&response_type=code&redirect_uri=${ROOT_URL}:${PORT}/oauth/kakao/redirect&prompt=login`,
    );
  }

  @Get('/kakao/redirect')
  @ApiOperation({
    summary: '토큰을 받기 위한 Redirect URL [클라이언트 접근 X]',
    description: `access-token이 클라이언트의 쿠키에 담기며, 가입된 유저의 정보를 제공하는 API입니다.
    \n가입된 유저일 경우 유저정보를 oauth/kakao/signin 경로에서 제공하지만
    \n가입되지 않은 유저일 경우 oauth/kakao/signup 경로로 kakao_id와 함께 유저 정보를 보내 회원가입을 해야합니다.`,
  })
  async getKakaoToken(
    @Query('code') code: string,
    @Res() res: Response,
  ): Promise<object> {
    const { access_token } = await this.oauthService.getTokensByKakao(code);
    const kakaoTokenData = await this.oauthService.getTokenDataByKakao(
      access_token,
    );
    const user = await this.publicService.findUserByKakaoId(kakaoTokenData.id);

    if (!user && !kakaoTokenData.kakao_account?.has_email)
      return res.send({
        message: 'failure',
        data: { kakao_id: kakaoTokenData.id },
      });
    else if (!user && kakaoTokenData.kakao_account?.has_email)
      return res.send({
        message: 'failure',
        data: {
          kakao_id: kakaoTokenData.id,
          e_mail: kakaoTokenData.kakao_account.email,
        },
      });

    const userInfo = this.publicService.translateToResUserInfo(user);
    const accessToken = this.authService.generateAccessToken(userInfo);
    this.authService.sendAccessToken(res, accessToken);

    return res.send({ message: 'success', data: userInfo });
  }

  @Post('/kakao/signup/:kakao_id')
  @ApiOperation({
    summary: '카카오 소셜 로그인을 위한 회원가입',
    description: `EOTD에 등록되지 않은 카카오 유저를 위한 회원가입 API입니다.`,
  })
  @ApiCreatedResponse(api.success.nulldata)
  @ApiBadRequestResponse(api.badRequest)
  @ApiConflictResponse(api.conflict.e_mail)
  async signup(
    @Body() dto: OauthCreateUserDto,
    @Param('kakao_id') kakao_id: number,
  ): Promise<object> {
    const user = await this.oauthService.createUser(kakao_id, dto);
    const userInfo = this.publicService.translateToResUserInfo(user);

    await this.authService.createCertificate(dto.e_mail, 'kakao_user');
    const { refreshToken, refreshSecret } =
      this.authService.generateRefreshTokenAndSecret(userInfo);
    await this.authService.updateRefreshToken(
      dto.e_mail,
      refreshToken,
      refreshSecret,
    );

    return { message: 'success', data: null };
  }
}
