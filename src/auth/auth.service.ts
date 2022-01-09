import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignupUserDto } from 'src/auth/dto/signup-user.dto';
import { User, UserDocument } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { VerifyAuthMailTokenDto } from 'src/auth/dto/verify-auth-mail-token.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { UserInfo } from 'src/users/interfaces/user-info.interface';
import {
  Certificate,
  CertificateDocument,
} from 'src/schemas/certificate.schema';
import { JWTTokenData } from 'src/auth/interfaces/jwt-token-data.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Certificate.name)
    private certificateModel: Model<CertificateDocument>,
    private readonly config: ConfigService,
  ) {}

  // signup & mail authorization

  generateAuthMailToken(): string {
    const authMailToken: string = uuid.v4();
    return authMailToken;
  }

  async verifyAuthMailToken(dto: VerifyAuthMailTokenDto): Promise<boolean> {
    const { e_mail, authMailToken } = dto;

    const certificate: Certificate = await this.certificateModel.findOne({
      e_mail,
    });
    if (!certificate && authMailToken !== certificate.authMailToken)
      return false;

    await this.userModel
      .updateOne({ e_mail }, { isVerifyMailToken: true })
      .catch(() => {
        throw new InternalServerErrorException(
          'No isVerifyMailToken-field has been updated',
        );
      });
    return true;
  }

  async createUser(userInfo: SignupUserDto): Promise<User> {
    const salt: string = bcrypt.genSaltSync();
    const password: string = bcrypt.hashSync(userInfo.password, salt);

    const createdUser: User = await this.userModel
      .create({
        ...userInfo,
        password,
      })
      .catch(() => {
        throw new ConflictException(`Existing e_mail : ${userInfo.e_mail}`);
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
    return;
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

  async findCertificate(e_mail: string): Promise<Certificate> {
    const certificate: Certificate = await this.certificateModel.findOne({
      e_mail,
    });

    if (!certificate) throw new NotFoundException('No exist user');
    return JSON.parse(JSON.stringify(certificate));
  }

  verifyJwtToken(token: string, secret: string): JWTTokenData {
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
