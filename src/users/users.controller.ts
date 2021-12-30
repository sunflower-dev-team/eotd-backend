import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { SignupUserDto } from 'src/dto/signup-user.dto';
import { MailToken } from 'src/interfaces/mail-token.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async sendSignupToken(@Body() newUserInfo: CreateUserDto): Promise<object> {
    try {
      await this.usersService.sendMail(newUserInfo);
    } catch {
      return { message: 'failure', data: null };
    }
    return { message: 'success', data: null };
  }

  @Get('signup')
  async verifyMail(@Query() checkInfo: SignupUserDto): Promise<any> {
    if (checkInfo.m === 'checkEmail') {
      const isExistSameEmail = await this.usersService.checkSameEmail(
        checkInfo.e_mail,
      );
      return { message: 'success', data: isExistSameEmail };
    } else if (checkInfo.m === 'checkMailToken') {
      const userInfo: MailToken = this.usersService.checkMailToken(
        checkInfo.token,
        checkInfo.secret,
      );
      if (!userInfo) return; // render 유효하지 않은 페이지
      const isExistSameEmail = await this.usersService.checkSameEmail(
        userInfo.e_mail,
      );
      if (isExistSameEmail) return; // render 유효하지 않은 페이지
      this.usersService.create(userInfo);
      return; // render 가입성공
    }
  }
}
