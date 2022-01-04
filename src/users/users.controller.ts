import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:e_mail')
  async verifyEmail(@Param('e_mail') e_mail: string): Promise<object> {
    const user: User | null = await this.usersService.findUser(e_mail);
    if (!user) throw new NotFoundException('Not exist user');
    return { message: 'success', data: null };
  }
}
