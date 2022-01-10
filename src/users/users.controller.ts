import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { VerifyMailGuard } from 'src/auth/guards/verify-mail.guard';
import { CreateUserDetailDto } from './dto/create-user-detail.dto';
import { UpdateUserDetailDto } from './dto/update-user-detail.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/detail')
  @UseGuards(VerifyMailGuard)
  async findOneUserDetail(@Req() req: Request) {
    const { e_mail }: any = req.user;
    const userDetail = await this.usersService.findOneUserDetail(e_mail);
    return { message: 'success', data: userDetail };
  }

  @Post('/detail')
  @UseGuards(VerifyMailGuard)
  async createUserDetail(
    @Req() req: Request,
    @Body() dto: CreateUserDetailDto,
  ): Promise<object> {
    const { e_mail }: any = req.user;
    await this.usersService.createUserDetail(e_mail, dto);
    return { message: 'success', data: null };
  }

  @Patch('/detail')
  @UseGuards(VerifyMailGuard)
  async updateUserDetail(
    @Req() req: Request,
    @Body() dto: UpdateUserDetailDto,
  ): Promise<object> {
    const { e_mail }: any = req.user;
    await this.usersService.updateOneUserDetail(e_mail, dto);
    return { message: 'success', data: null };
  }

  @Get('/:e_mail')
  async validateEmail(@Param('e_mail') e_mail: string): Promise<object> {
    const userInfo = await this.usersService.findUser(e_mail);
    return { message: 'success', data: userInfo };
  }

  @Patch()
  @UseGuards(VerifyMailGuard)
  async updateOneUserInfo(
    @Req() req: Request,
    @Body() dto: UpdateUserDto,
  ): Promise<object> {
    const { e_mail }: any = req.user;
    await this.usersService.updateUser(e_mail, dto);
    return { message: 'success', data: null };
  }

  // smm bfm pbf
  // 주간 통계 데이터

  // 주간 운동 데이터

  // 월 운동 데이터
}
