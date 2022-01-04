import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignupUserDto } from 'src/auth/dto/signup-user.dto';
import { User, UserDocument } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { VerifyAuthMailToken } from 'src/auth/dto/verify-auth-mail-token.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { UserInfo } from 'src/interfaces/user-info.interface';
import {
  Certificate,
  CertificateDocument,
} from 'src/schemas/certificate.schema';
import { JWTTokenData } from 'src/interfaces/jwt-token-data.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private usersModel: Model<UserDocument>,
    @InjectModel(Certificate.name)
    private certificateModel: Model<CertificateDocument>,
    private readonly config: ConfigService,
  ) {}

  // signup & mail authorization

  generateAuthMailToken(): string {
    const authMailToken: string = uuid.v4();
    return authMailToken;
  }

  async verifyAuthMailToken(dto: VerifyAuthMailToken): Promise<boolean> {
    const { e_mail, authMailToken }: VerifyAuthMailToken = dto;
    const user: User | null = await this.usersModel
      .findOne({
        e_mail,
      })
      .catch(() => {
        return null;
      });
    if (!user) return false;
    else if (user.isVerifyMailToken) return false;

    const userAuth: Certificate | null = await this.certificateModel
      .findOne({ e_mail })
      .catch(() => {
        return null;
      });
    if (!userAuth && authMailToken !== userAuth.authMailToken) return false;

    await this.usersModel
      .updateOne({ e_mail }, { isVerifyMailToken: true })
      .catch(() => {
        throw new InternalServerErrorException(
          'isVerifyMailToken field update Error',
        );
      });
    return true;
  }

  async createUser(userInfo: SignupUserDto): Promise<User | null> {
    const salt: string = bcrypt.genSaltSync();
    const password: string = bcrypt.hashSync(userInfo.password, salt);

    const createdUser: User | null = await this.usersModel
      .create({
        ...userInfo,
        password,
      })
      .catch(() => {
        return null;
      });
    return JSON.parse(JSON.stringify(createdUser));
  }

  async createCertificate(
    e_mail: string,
    authMailToken: string,
  ): Promise<void> {
    await this.certificateModel
      .create({
        e_mail,
        authMailToken,
      })
      .catch(() => {
        throw new InternalServerErrorException(
          'No authentication model has been created',
        );
      });
  }

  // jwt Refresh

  generateRefreshTokenAndSecret(userInfo: UserInfo): {
    refreshToken: string;
    refreshSecret: string;
  } {
    const refreshSecret: string = uuid.v4();
    const refreshToken: string = this.jwtService.sign(
      { ...userInfo },
      {
        secret: refreshSecret,
        expiresIn: 60 * 60 * 24 * 7,
      },
    );
    return { refreshToken, refreshSecret };
  }

  async updateRefreshToken(
    e_mail: string,
    refreshToken: string,
    refreshSecret: string,
  ): Promise<void> {
    await this.certificateModel
      .updateOne({ e_mail }, { refreshToken, refreshSecret })
      .catch(() => {
        throw new InternalServerErrorException(
          'No authentication model has been updated',
        );
      });
    return;
  }

  async findAuthData(e_mail: string): Promise<Certificate> {
    const authData: Certificate | null = await this.certificateModel
      .findOne({ e_mail })
      .catch(() => {
        throw new InternalServerErrorException();
      });
    return JSON.parse(JSON.stringify(authData));
  }

  verifyJwtToken(token: string, secret: string): JWTTokenData | null {
    try {
      return this.jwtService.verify(token, { secret });
    } catch {
      return null;
    }
  }

  // jwt Access

  generateAccessToken(payload: UserInfo): string {
    const JWT_ACCESS_SECRET = this.config.get('JWT_ACCESS_SECRET');
    const accessToken: string = this.jwtService.sign(payload, {
      secret: JWT_ACCESS_SECRET,
      expiresIn: 60 * 60,
    });
    return accessToken;
  }

  sendAccessToken(res: Response, token: string): void {
    res.cookie('accessToken', token, {
      httpOnly: true,
      // domain: 'localhost',
      // sameSite: 'none',
      // secure: true,
      maxAge: 1000 * 60 * 60,
    });
    return;
  }

  // signin

  validatePassword(plainPassword: string, encryptedPassword: string): boolean {
    return bcrypt.compareSync(plainPassword, encryptedPassword);
  }
}
