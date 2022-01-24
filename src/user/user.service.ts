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

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserDetail.name)
    private userDetailModel: Model<UserDetailDocument>,
  ) {}

  // C-user
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

  // U-user
  async updateUser(e_mail: string, userInfo: UpdateUserDto): Promise<User> {
    if (userInfo.password) {
      const salt: string = bcrypt.genSaltSync();
      const password: string = bcrypt.hashSync(userInfo.password, salt);
      userInfo.password = password;
    }
    const updatedUser = await this.userModel
      .findOneAndUpdate({ e_mail }, userInfo, { new: true })
      .catch(() => {
        throw new InternalServerErrorException(
          'User-info has not been updated',
        );
      });

    return updatedUser;
  }

  // D-user
  async deleteUser(e_mail: string): Promise<void> {
    const previousUser = await this.userModel
      .findOneAndDelete({ e_mail })
      .catch(() => {
        throw new InternalServerErrorException('User has not been deleted');
      });
    if (!previousUser) throw new NotFoundException('No exist user');
    return;
  }

  // C-detail
  async createUserDetail(
    e_mail: string,
    detailInfo: CreateUserDetailDto,
  ): Promise<void> {
    await this.userDetailModel
      .create({ e_mail, ...detailInfo })
      .catch(async () => {
        if (await this.userDetailModel.exists({ e_mail }))
          throw new ConflictException(`Existing ${e_mail}'s detail`);
        throw new ConflictException(`Existing nickname:${detailInfo.nickname}`);
      });
    return;
  }

  // R-detail
  async findUserDetail(e_mail: string): Promise<UserDetail> {
    const detailInfo: UserDetail = await this.userDetailModel
      .findOne({ e_mail })
      .select({ _id: 0 });

    if (!detailInfo) throw new NotFoundException(`No exist ${e_mail}'s detail`);
    return detailInfo;
  }

  // U-detail
  async updateUserDetail(
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

  // D-detail
  async deleteUserDetail(e_mail: string): Promise<void> {
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
