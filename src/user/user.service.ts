import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { UserDetail, UserDetailDocument } from 'src/schemas/user-detail.schema';
import { Model } from 'mongoose';
import { UpdateUserDetailDto } from './dto/update-user-detail.dto';
import { CreateUserDetailDto } from './dto/create-user-detail.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserDetail.name)
    private userDetailModel: Model<UserDetailDocument>,
  ) {}

  // C-user
  async createUser(userInfo: CreateUserDto): Promise<User> {
    const salt: string = bcrypt.genSaltSync();
    const password: string = bcrypt.hashSync(userInfo.password, salt);

    const user: User = await this.userModel
      .create({
        _id: uuid.v4(),
        ...userInfo,
        password,
      })
      .catch(() => {
        throw new ConflictException(`Existing e_mail : ${userInfo.e_mail}`);
      });
    return user;
  }

  // U-user
  async updateUser(_id: string, userInfo: UpdateUserDto): Promise<User> {
    if (userInfo.password) {
      const salt: string = bcrypt.genSaltSync();
      const password: string = bcrypt.hashSync(userInfo.password, salt);
      userInfo.password = password;
    }
    const updatedUser = await this.userModel
      .findByIdAndUpdate(_id, userInfo, { new: true })
      .catch(() => {
        throw new InternalServerErrorException(
          'User-info has not been updated',
        );
      });

    return updatedUser;
  }

  // D-user
  async deleteUser(_id: string): Promise<void> {
    const previousUser = await this.userModel
      .findByIdAndDelete(_id)
      .catch(() => {
        throw new InternalServerErrorException('User has not been deleted');
      });
    if (!previousUser) throw new NotFoundException('No exist user');
    return;
  }

  // C-detail
  async createUserDetail(
    _id: string,
    detailInfo: CreateUserDetailDto,
  ): Promise<void> {
    await this.userDetailModel
      .create({ _id, ...detailInfo })
      .catch(async () => {
        if (await this.userDetailModel.exists({ _id }))
          throw new ConflictException(`Existing user's detail`);
        throw new ConflictException(`Existing nickname:${detailInfo.nickname}`);
      });
    return;
  }

  // R-detail
  async findUserDetail(_id: string): Promise<UserDetail> {
    const detailInfo: UserDetail = await this.userDetailModel.findById(_id);

    if (!detailInfo) throw new NotFoundException(`No exist user's detail`);
    return detailInfo;
  }

  // U-detail
  async updateUserDetail(
    _id: string,
    detailInfo: UpdateUserDetailDto,
  ): Promise<void> {
    const previousDetail = await this.userDetailModel
      .findByIdAndUpdate(_id, detailInfo)
      .catch(() => {
        throw new InternalServerErrorException(
          `User'detail has not been updated`,
        );
      });

    if (!previousDetail) throw new NotFoundException(`No exist user's detail`);
    return;
  }

  // D-detail
  async deleteUserDetail(_id: string): Promise<void> {
    const previousDetail = await this.userDetailModel
      .findByIdAndDelete(_id)
      .catch(() => {
        throw new InternalServerErrorException(
          `User'detail has not been deleted`,
        );
      });

    if (!previousDetail) throw new NotFoundException(`No exist user's detail`);
    return;
  }
}
