import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { UserDetail, UserDetailDocument } from 'src/schemas/user-detail.schema';
import { UpdateUserDetailDto } from './dto/update-user-detail.dto';
import { CreateUserDetailDto } from './dto/create-user-detail.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserDetail.name)
    private userDetailModel: Model<UserDetailDocument>,
  ) {}

  // user C

  async createUser(userInfo: CreateUserDto): Promise<void> {
    const salt: string = bcrypt.genSaltSync();
    const password: string = bcrypt.hashSync(userInfo.password, salt);

    await this.userModel
      .create({
        ...userInfo,
        password,
      })
      .catch(() => {
        throw new ConflictException(`Existing e_mail : ${userInfo.e_mail}`);
      });
    return;
  }

  // user R

  async findUser(e_mail: string): Promise<User> {
    const user: User | null = await this.userModel
      .findOne({ e_mail })
      .select({ _id: 0 });

    if (!user) throw new NotFoundException('No exist user');
    return JSON.parse(JSON.stringify(user));
  }

  // user U

  async updateUser(e_mail: string, userInfo: UpdateUserDto) {
    if (userInfo.password) {
      const salt: string = bcrypt.genSaltSync();
      const password: string = bcrypt.hashSync(userInfo.password, salt);
      userInfo.password = password;
    }
    const previousUserInfo = await this.userModel
      .findOneAndUpdate({ e_mail }, userInfo)
      .catch(() => {
        throw new InternalServerErrorException(
          'User-info has not been updated',
        );
      });

    if (!previousUserInfo) throw new NotFoundException('No exist user');
    return;
  }

  // func

  // detail C

  async createUserDetail(
    e_mail: string,
    detailInfo: CreateUserDetailDto,
  ): Promise<void> {
    await this.userDetailModel.create({ e_mail, ...detailInfo }).catch(() => {
      throw new ConflictException(`Existing ${e_mail}'s detail`);
    });
    return;
  }

  // detail R

  async findOneUserDetail(e_mail: string): Promise<UserDetail> {
    const detailInfo: UserDetail = await this.userDetailModel
      .findOne({ e_mail })
      .select({ _id: 0 });

    if (!detailInfo) throw new NotFoundException(`No exist ${e_mail}'s detail`);
    return detailInfo;
  }

  // detail U

  async updateOneUserDetail(
    e_mail: string,
    detailInfo: UpdateUserDetailDto,
  ): Promise<void> {
    const previousDetail = await this.userDetailModel
      .findOneAndUpdate({ e_mail }, detailInfo)
      .catch(() => {
        throw new InternalServerErrorException(
          `User'detail has not been updated`,
        );
      });

    if (!previousDetail)
      throw new NotFoundException(`No exist ${e_mail}'s detail`);
    return;
  }

  // detail D

  async deleteOneUserDetail(e_mail: string): Promise<void> {
    const previousDetail = await this.userDetailModel
      .findOneAndDelete({
        e_mail,
      })
      .catch(() => {
        throw new InternalServerErrorException(
          `User'detail has not been deleted`,
        );
      });

    if (!previousDetail)
      throw new NotFoundException(`No exist ${e_mail}'s detail`);
    return;
  }
}
