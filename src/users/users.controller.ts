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
import {
  ApiTags,
  ApiParam,
  ApiCookieAuth,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { api } from 'src/swagger';

@Controller('users')
@ApiTags('유저 API')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/detail')
  @ApiOperation({
    summary: '유저의 디테일한 정보 조회',
    description: `유저의 디테일한 정보를 가져오는 API입니다.`,
  })
  @ApiCookieAuth()
  @ApiOkResponse(api.success.userDetail)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.mail)
  @ApiNotFoundResponse(api.notFound.detail)
  @UseGuards(VerifyMailGuard)
  async findOneUserDetail(@Req() req: Request): Promise<object> {
    const { e_mail }: any = req.user;
    const userDetail = await this.usersService.findOneUserDetail(e_mail);
    return { message: 'success', data: userDetail };
  }

  @Get('/:e_mail')
  @ApiOperation({
    summary: '특정한 유저의 정보 조회 - [중복이메일 유효성 검사]로도 사용 가능',
    description: `특정한 유저의 정보를 가져오는 API입니다.`,
  })
  @ApiParam({ name: 'e_mail', description: '이메일', required: true })
  @ApiOkResponse(api.success.user)
  @ApiNotFoundResponse(api.notFound.user)
  async validateEmail(@Param('e_mail') e_mail: string): Promise<object> {
    const userInfo = await this.usersService.findUser(e_mail);
    return { message: 'success', data: userInfo };
  }

  @Patch()
  @ApiOperation({
    summary:
      '유저의 정보 수정 - [비밀번호 수정 시 인증 API의 패스워드 일치 확인을 해야합니다]',
    description: `유저의 정보를 수정하는 API입니다.`,
  })
  @ApiCookieAuth()
  @ApiOkResponse(api.success.nulldata)
  @ApiBadRequestResponse(api.badRequest)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.mail)
  @ApiNotFoundResponse(api.notFound.user)
  @UseGuards(VerifyMailGuard)
  async updateOneUserInfo(
    @Req() req: Request,
    @Body() dto: UpdateUserDto,
  ): Promise<object> {
    const { e_mail }: any = req.user;
    await this.usersService.updateUser(e_mail, dto);
    return { message: 'success', data: null };
  }

  @Post('/detail')
  @ApiOperation({
    summary: '유저의 디테일 생성',
    description: `유저의 디테일을 생성하는 API입니다.`,
  })
  @ApiCookieAuth()
  @ApiCreatedResponse(api.success.nulldata)
  @ApiBadRequestResponse(api.badRequest)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.mail)
  @ApiConflictResponse(api.conflict.detail)
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
  @ApiOperation({
    summary: '유저의 디테일한 정보 수정',
    description: `유저의 디테일한 정보를 수정하는 API입니다.`,
  })
  @ApiCookieAuth()
  @ApiOkResponse(api.success.nulldata)
  @ApiBadRequestResponse(api.badRequest)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.mail)
  @ApiNotFoundResponse(api.notFound.detail)
  @UseGuards(VerifyMailGuard)
  async updateUserDetail(
    @Req() req: Request,
    @Body() dto: UpdateUserDetailDto,
  ): Promise<object> {
    const { e_mail }: any = req.user;
    await this.usersService.updateOneUserDetail(e_mail, dto);
    return { message: 'success', data: null };
  }

  // smm bfm pbf
  // 주간 통계 데이터

  // 주간 운동 데이터

  // 월 운동 데이터
}
