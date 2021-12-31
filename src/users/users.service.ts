import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async checkSameEmail(e_mail: string): Promise<boolean> {
    const sameEmail: User | null = await this.userModel.findOne({ e_mail });
    return sameEmail ? true : false;
  }
}
