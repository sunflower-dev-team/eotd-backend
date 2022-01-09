import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:e_mail')
  async validateEmail(@Param('e_mail') e_mail: string): Promise<object> {
    const user = await this.usersService.findUser(e_mail);
    const userInfo = this.usersService.translateToResData(user);

    return { message: 'success', data: userInfo };
  }
}
