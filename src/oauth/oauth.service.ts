import { ConflictException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import { KakaoToken } from './interfaces/kakao-token.interface';
import { ConfigService } from '@nestjs/config';
import { KakaoTokenData } from './interfaces/kakao-token-data';
import { OauthCreateUserDto } from './dto/oauth-create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import * as uuid from 'uuid';

@Injectable()
export class OauthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {}

  async getTokensByKakao(code: string): Promise<KakaoToken> {
    const ROOT_URL = this.config.get('ROOT_URL');
    const PORT = this.config.get('PORT');
    const redirect_uri = `${ROOT_URL}:${PORT}/oauth/kakao/redirect`;

    const KAKAO_REST_API_KEY = this.config.get('KAKAO_REST_API_KEY');
    const KAKAO_CLIENT_SECRET = this.config.get('KAKAO_CLIENT_SECRET');

    const kakaoToken: KakaoToken = await firstValueFrom(
      this.httpService
        .post<any>('https://kauth.kakao.com/oauth/token', '', {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          params: {
            grant_type: 'authorization_code',
            client_id: `${KAKAO_REST_API_KEY}`,
            client_secret: `${KAKAO_CLIENT_SECRET}`,
            redirect_uri: `${redirect_uri}`,
            code: `${code}`,
          },
        })
        .pipe(map((response) => response.data)),
    );
    const { access_token, refresh_token } = kakaoToken;

    return { access_token, refresh_token };
  }

  async getTokenDataByKakao(accessToken: string): Promise<KakaoTokenData> {
    const kakaoTokenData: KakaoTokenData = await firstValueFrom(
      this.httpService
        .get('https://kapi.kakao.com/v2/user/me', {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .pipe(map((response) => response.data)),
    );
    return kakaoTokenData;
  }

  async createUser(
    kakao_id: number,
    userInfo: OauthCreateUserDto,
  ): Promise<User> {
    const user: User = await this.userModel
      .create({ _id: uuid.v4(), kakao_id, ...userInfo, isAuthorized: true })
      .catch(() => {
        throw new ConflictException(`Existing user's kakao_id : ${kakao_id}`);
      });
    return user;
  }
}
