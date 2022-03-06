import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import * as uuid from 'uuid';
import { VerifyAuthMailTokenDto } from 'src/auth/dto/verify-auth-mail-token.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { UserInfo } from 'src/user/interfaces/user-info.interface';
import {
  Certificate,
  CertificateDocument,
} from 'src/schemas/certificate.schema';
import { JWTTokenData } from 'src/auth/interfaces/jwt-token-data.interface';
import * as bcyrpt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Certificate.name)
    private certificateModel: Model<CertificateDocument>,
    private readonly config: ConfigService,
  ) {}

  // verify-auth-mail-token
  async isVerifyAuthMailToken(dto: VerifyAuthMailTokenDto): Promise<boolean> {
    const { _id, authMailToken } = dto;
    const certificate: Certificate = await this.certificateModel.findById(_id);

    if (!certificate && authMailToken !== certificate.authMailToken)
      return false;

    const user: User = await this.userModel.findByIdAndUpdate(_id, {
      isAuthorized: true,
    });
    if (!user)
      throw new InternalServerErrorException(
        'No isAuthorized-field has been updated',
      );
    return true;
  }

  // C-temporary password
  async getTemporaryPassword(
    _id: string,
  ): Promise<{ temporaryPassword: string; user: User }> {
    const salt = bcyrpt.genSaltSync(2);
    const temporaryPassword: string = '!' + uuid.v1().slice(0, 8);

    const user: User = await this.userModel.findByIdAndUpdate(
      _id,
      { password: bcyrpt.hashSync(temporaryPassword, salt) },
      { new: true },
    );
    if (!user)
      throw new InternalServerErrorException(
        'No password-field has been updated',
      );
    return { temporaryPassword, user };
  }

  // C-certificate
  async createCertificate(_id: string, authMailToken: string): Promise<void> {
    await this.certificateModel.create({ _id, authMailToken }).catch(() => {
      throw new InternalServerErrorException(
        'No authentication model has been created',
      );
    });
    return;
  }

  // R-certificate
  async findCertificate(_id: string): Promise<Certificate> {
    const certificate: Certificate = await this.certificateModel.findById(_id);

    if (!certificate) throw new NotFoundException('No exist user');
    return JSON.parse(JSON.stringify(certificate));
  }

  // U-certificate
  async updateRefreshToken(
    _id: string,
    refreshToken: string,
    refreshSecret: string,
  ): Promise<void> {
    await this.certificateModel
      .findByIdAndUpdate(_id, { refreshToken, refreshSecret })
      .catch(() => {
        throw new InternalServerErrorException(
          'No authentication model has been updated',
        );
      });
    return;
  }

  async updateAuthMailToken(_id: string, authMailToken: string): Promise<void> {
    await this.certificateModel
      .findByIdAndUpdate(_id, { authMailToken })
      .catch(() => {
        throw new InternalServerErrorException(
          'No authentication model has been updated',
        );
      });
    return;
  }

  // D-certificate
  async deleteCertificate(_id: string): Promise<void> {
    const previousCertificate: Certificate = await this.certificateModel
      .findByIdAndDelete(_id)
      .catch(() => {
        throw new InternalServerErrorException(
          'No authentication model has been deleted',
        );
      });
    if (!previousCertificate)
      throw new NotFoundException(`No exist user's certificate`);
    return;
  }

  // C-RT
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

  // C-AT
  generateAccessToken(payload: UserInfo): string {
    const JWT_ACCESS_SECRET = this.config.get('JWT_ACCESS_SECRET');
    const accessToken: string = this.jwtService.sign(payload, {
      secret: JWT_ACCESS_SECRET,
      expiresIn: 60 * 60,
    });
    return accessToken;
  }

  // send-AT
  sendAccessToken(res: Response, token: string): void {
    res.cookie('accessToken', token, {
      httpOnly: true,
      domain: '*',
      // sameSite: 'none',
      // secure: true,
      maxAge: 1000 * 60 * 60,
    });
    return;
  }

  // D-AT
  removeAccessToken(res: Response): void {
    res.clearCookie('accessToken');
    return;
  }

  // verify-(JWT)
  verifyJwtToken(token: string, secret: string): JWTTokenData {
    try {
      return this.jwtService.verify(token, { secret });
    } catch {
      return null;
    }
  }
}
