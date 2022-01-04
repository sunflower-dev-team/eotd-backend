import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { UserInfo } from 'src/interfaces/user-info.interface';
import { User } from 'src/schemas/user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:e_mail')
  async validateEmail(@Param('e_mail') e_mail: string): Promise<object> {
    const user: User | null = await this.usersService.findUser(e_mail);
    if (!user) throw new NotFoundException('No exist user');
    const userInfo: UserInfo = this.usersService.translateToResData(user);
    return { message: 'success', data: userInfo };
  }
}
