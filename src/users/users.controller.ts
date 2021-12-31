import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:e_mail')
  async verifyEmail(@Param('e_mail') e_mail: string): Promise<any> {
    const isExistSameEmail = await this.usersService.checkSameEmail(e_mail);
    return { message: 'success', data: isExistSameEmail };
  }
}
