import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { api } from 'src/swagger';
import { Request } from 'express';
import { VerifyMailGuard } from 'src/auth/guards/verify-mail.guard';
import { DailyService } from './daily.service';
import { PublicService } from 'src/public.service';
import { CreateDailyDietDto } from './dto/create-daily-diet.dto';
import { CreateDailyExerciseDto } from './dto/create-daily-exercise.dto';
import {
  UpdateDailyDietBodyDto,
  UpdateDailyDietQueryDto,
} from './dto/update-daily-diet.dto';
import {
  UpdateDailyExerciseQueryDto,
  UpdateDailyExerciseBodyDto,
} from './dto/update-daily-exercise.dto';
import { DeleteDailyDietOrExerciseDto } from './dto/delete-daily.dietOrExercise.dto';
import { DailyDietInfo } from 'src/daily/interfaces/daily-diet-info.interface';
import { DailyExerciseInfo } from 'src/daily/interfaces/daily-exercise-info.interface';
import * as uuid from 'uuid';

@Controller('daily')
@ApiTags('데일리 API')
export class DailyController {
  constructor(
    private readonly dailyService: DailyService,
    private readonly publicService: PublicService,
  ) {}

  @Get('/')
  @ApiOperation({
    summary: '모든 날짜의 데일리 기록들 조회',
    description: `접속한 유저가 기록해왔던 모든 날짜의 데일리 기록들을 조회하는 API입니다.`,
  })
  @ApiCookieAuth()
  @ApiOkResponse(api.success.dailyList)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.mail)
  @ApiNotFoundResponse(api.notFound.dailyList)
  @UseGuards(VerifyMailGuard)
  async findAllDaily(@Req() req: Request): Promise<object> {
    const { e_mail }: any = req.user;
    const dailyInfoList = await this.dailyService.findAllDaily(e_mail);

    return { message: 'success', data: dailyInfoList };
  }

  @Get('/:date')
  @ApiOperation({
    summary: '특정 날짜의 데일리 기록 조회',
    description: `접속한 유저가 기록했던 특정 날짜의 데일리 기록을 조회하는 API입니다.`,
  })
  @ApiCookieAuth()
  @ApiOkResponse(api.success.daily)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.mail)
  @ApiNotFoundResponse(api.notFound.daily)
  @UseGuards(VerifyMailGuard)
  async findOneDaily(
    @Req() req: Request,
    @Param('date') date: number,
  ): Promise<object> {
    const { e_mail }: any = req.user;
    const dailyInfo = await this.dailyService.findOneDaily(e_mail, date);

    return { message: 'success', data: dailyInfo };
  }

  @Post('/diet')
  @ApiOperation({
    summary: '데일리 식단 생성',
    description: `현재 날짜의 데일리에 새롭게 작성된 식단을 추가하는 API입니다.`,
  })
  @ApiCookieAuth()
  @ApiCreatedResponse(api.success.nulldata)
  @ApiBadRequestResponse(api.badRequest)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.mail)
  @UseGuards(VerifyMailGuard)
  async createDailyDiet(
    @Req() req: Request,
    @Body() dto: CreateDailyDietDto,
  ): Promise<object> {
    const { e_mail }: any = req.user;
    const date = this.publicService.getCurrentDate();
    const dietInfo: DailyDietInfo = { diet_id: uuid.v4(), ...dto };

    await this.dailyService.findOrCreateDaliyForm(e_mail, date);
    await this.dailyService.createDailyDiet(e_mail, date, dietInfo);

    return { message: 'success', data: null };
  }

  @Patch('/diet')
  @ApiOperation({
    summary: '데일리 식단 수정',
    description: `특정 date와 diet_id를 받아 해당 식단을 수정하는 API입니다.`,
  })
  @ApiCookieAuth()
  @ApiOkResponse(api.success.nulldata)
  @ApiBadRequestResponse(api.badRequest)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.mail)
  @ApiNotFoundResponse(api.notFound.dailyOrDietId)
  @UseGuards(VerifyMailGuard)
  async updateOneDailyDiet(
    @Req() req: Request,
    @Query() queryDto: UpdateDailyDietQueryDto,
    @Body() dto: UpdateDailyDietBodyDto,
  ) {
    const { e_mail }: any = req.user;
    const { date, diet_id } = queryDto;

    await this.dailyService.updateOneDailyDiet(e_mail, date, diet_id, dto);

    return { message: 'success', data: null };
  }

  @Delete('/diet/:date')
  @ApiOperation({
    summary: '데일리 식단 삭제',
    description: `[target=all] 해당 날짜에 기록된 데일리의 모든 식단을 삭제하는 API입니다.
    \n[target=diet_id] 해당 날짜에 기록된 데일리의 특정한 식단을 삭제하는 API입니다.
    \ntarget=all 에서 all은 대소문자 상관이 없습니다.`,
  })
  @ApiCookieAuth()
  @ApiOkResponse(api.success.nulldata)
  @ApiBadRequestResponse(api.badRequest)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.mail)
  @ApiNotFoundResponse(api.notFound.dailyOrDietId)
  @UseGuards(VerifyMailGuard)
  async deleteDailyDiet(
    @Req() req: Request,
    @Param('date') date: number,
    @Body() dto: DeleteDailyDietOrExerciseDto,
  ) {
    const { e_mail }: any = req.user;

    if (dto.target.toLowerCase() === 'all')
      await this.dailyService.deleteAllDailyDiet(e_mail, date);
    else await this.dailyService.deleteOneDailyDiet(e_mail, date, dto.target);

    return { message: 'success', data: null };
  }

  @Post('/exercise')
  @ApiOperation({
    summary: '데일리 운동 생성',
    description: `현재 날짜의 데일리에 새롭게 작성된 운동을 추가하는 API입니다.`,
  })
  @ApiCookieAuth()
  @ApiCreatedResponse(api.success.nulldata)
  @ApiBadRequestResponse(api.badRequest)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.mail)
  @UseGuards(VerifyMailGuard)
  async createDailyExercise(
    @Req() req: Request,
    @Body() dto: CreateDailyExerciseDto,
  ): Promise<object> {
    const { e_mail }: any = req.user;
    const date: number = this.publicService.getCurrentDate();
    const exerciseInfo: DailyExerciseInfo = { exercise_id: uuid.v4(), ...dto };

    await this.dailyService.findOrCreateDaliyForm(e_mail, date);
    await this.dailyService.createDailyExercise(e_mail, date, exerciseInfo);

    return { message: 'success', data: null };
  }

  @Patch('/exercise')
  @ApiOperation({
    summary: '데일리 운동 수정',
    description: `특정 date와 exercise_id를 받아 해당 운동을 수정하는 API입니다.`,
  })
  @ApiCookieAuth()
  @ApiOkResponse(api.success.nulldata)
  @ApiBadRequestResponse(api.badRequest)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.mail)
  @ApiNotFoundResponse(api.notFound.dailyOrExerciseId)
  @UseGuards(VerifyMailGuard)
  async updateOneDailyExercise(
    @Req() req: Request,
    @Query() query: UpdateDailyExerciseQueryDto,
    @Body() dto: UpdateDailyExerciseBodyDto,
  ): Promise<object> {
    const { e_mail }: any = req.user;
    const { date, exercise_id } = query;

    await this.dailyService.updateOneDailyExercise(
      e_mail,
      date,
      exercise_id,
      dto,
    );

    return { message: 'success', data: null };
  }

  @Delete('/exercise/:date')
  @ApiOperation({
    summary: '데일리 운동 삭제',
    description: `[target=all] 해당 날짜에 기록된 데일리의 모든 식단을 삭제하는 API입니다.
    \n[target=diet_id] 해당 날짜에 기록된 데일리의 특정한 식단을 삭제하는 API입니다.
    \ntarget=all 에서 all은 대소문자 상관이 없습니다.`,
  })
  @ApiCookieAuth()
  @ApiOkResponse(api.success.nulldata)
  @ApiBadRequestResponse(api.badRequest)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.mail)
  @ApiNotFoundResponse(api.notFound.dailyOrExerciseId)
  @UseGuards(VerifyMailGuard)
  async deleteDailyExercise(
    @Req() req: Request,
    @Param('date') date: number,
    @Body() dto: DeleteDailyDietOrExerciseDto,
  ): Promise<object> {
    const { e_mail }: any = req.user;

    if (dto.target.toLowerCase() === 'all')
      await this.dailyService.deleteAllDailyExercise(e_mail, date);
    else
      await this.dailyService.deleteOneDailyExercise(e_mail, date, dto.target);

    return { message: 'success', data: null };
  }
}
