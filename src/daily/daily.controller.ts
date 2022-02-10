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
import { CreateDailyRoutineDto } from './dto/create-daily-routine.dto';
import { CreateDailyExerciseDto } from './dto/create-daily-exercise.dto';
import { UpdateDailyDietBodyDto } from './dto/update-daily-diet.dto';
import { UpdateDailyRoutineBodyDto } from './dto/update-daily-routine.dto';
import { UpdateDailyExerciseBodyDto } from './dto/update-daily-exercise.dto';
import {
  DeleteDailyRoutineQueryDto,
  UpdateDailyRoutineQueryDto,
} from './dto/query-daily-routine.dto';
import {
  DeleteDailyExerciseQueryDto,
  UpdateDailyExerciseQueryDto,
} from './dto/query-daily-exercise.dto';
import {
  DeleteDailyDietQueryDto,
  UpdateDailyDietQueryDto,
} from './dto/query-daily-diet.dto';
import { DailyDiet } from 'src/schemas/daily-diet.schema';
import { DailyRoutine } from 'src/schemas/daily-routine.schema';
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
    summary: '모든 날짜의 데일리 조회',
    description: `모든 날짜의 데일리를 조회하는 API입니다.`,
  })
  @ApiCookieAuth()
  @ApiOkResponse(api.success.dailys)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.mail)
  @ApiNotFoundResponse(api.notFound.dailys)
  @UseGuards(VerifyMailGuard)
  async findDailys(@Req() req: Request): Promise<object> {
    const { _id }: any = req.user;
    const dailys = await this.dailyService.findDailys(_id);

    return { message: 'success', data: dailys.dailys };
  }

  @Get('/:date')
  @ApiOperation({
    summary: '특정 날짜의 데일리 조회',
    description: `특정 날짜의 데일리를 조회하는 API입니다.`,
  })
  @ApiCookieAuth()
  @ApiOkResponse(api.success.daily)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.mail)
  @ApiNotFoundResponse(api.notFound.daily)
  @UseGuards(VerifyMailGuard)
  async findDaily(
    @Req() req: Request,
    @Param('date') date: number,
  ): Promise<object> {
    const { _id }: any = req.user;
    const daily = await this.dailyService.findDaily(_id, date);

    return { message: 'success', data: daily };
  }

  @Delete('/:date')
  @ApiOperation({
    summary: '특정 날짜의 데일리 삭제',
    description: `특정 날짜의 데일리를 삭제하는 API입니다.`,
  })
  @ApiCookieAuth()
  @ApiOkResponse(api.success.nulldata)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.mail)
  @ApiNotFoundResponse(api.notFound.daily)
  @UseGuards(VerifyMailGuard)
  async deleteDaily(
    @Req() req: Request,
    @Param('date') date: number,
  ): Promise<object> {
    const { _id }: any = req.user;
    await this.dailyService.deleteDaily(_id, date);

    return { message: 'success', data: null };
  }

  @Post('/diet')
  @ApiOperation({
    summary: '데일리 식단 생성',
    description: `현재 날짜에 새로운 식단을 추가하는 API입니다.`,
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
    const { _id }: any = req.user;
    const date = this.publicService.getCurrentDate();
    const daily_diet: DailyDiet = { diet_id: uuid.v4(), ...dto };

    await this.dailyService.findOrCreateDailyForm(_id, date);
    await this.dailyService.createDailyDiet(_id, date, daily_diet);

    return { message: 'success', data: null };
  }

  @Patch('/diet')
  @ApiOperation({
    summary: '데일리 식단 수정',
    description: `특정한 식단을 수정하는 API입니다.`,
  })
  @ApiCookieAuth()
  @ApiOkResponse(api.success.nulldata)
  @ApiBadRequestResponse(api.badRequest)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.mail)
  @UseGuards(VerifyMailGuard)
  async updateDailyDiet(
    @Req() req: Request,
    @Query() query: UpdateDailyDietQueryDto,
    @Body() dto: UpdateDailyDietBodyDto,
  ) {
    const { _id }: any = req.user;
    const { date, diet_id } = query;

    await this.dailyService.updateDailyDiet(_id, date, diet_id, dto);

    return { message: 'success', data: null };
  }

  @Delete('/diet')
  @ApiOperation({
    summary: '데일리 식단 삭제',
    description: `1. diet_id가 없을 경우 date에 해당하는 전체 식단을 삭제합니다.
    \n2. diet_id가 있을 경우 date, diet_id에 해당하는 식단을 삭제합니다.`,
  })
  @ApiCookieAuth()
  @ApiOkResponse(api.success.nulldata)
  @ApiBadRequestResponse(api.badRequest)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.mail)
  @UseGuards(VerifyMailGuard)
  async deleteDailyDiet(
    @Req() req: Request,
    @Query() query: DeleteDailyDietQueryDto,
  ) {
    const { _id }: any = req.user;
    const { date, diet_id } = query;

    if (!diet_id) await this.dailyService.deleteAllDailyDiet(_id, date);
    else await this.dailyService.deleteOneDailyDiet(_id, date, diet_id);

    return { message: 'success', data: null };
  }

  @Post('/routine')
  @ApiOperation({
    summary: '데일리 루틴 생성',
    description: `현재 날짜에 새로운 운동 루틴을 추가하는 API입니다.
    \n루틴을 생성한 후에 운동을 추가할 수 있습니다.`,
  })
  @ApiCookieAuth()
  @ApiCreatedResponse(api.success.nulldata)
  @ApiBadRequestResponse(api.badRequest)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.mail)
  @UseGuards(VerifyMailGuard)
  async createDailyRoutine(
    @Req() req: Request,
    @Body() dto: CreateDailyRoutineDto,
  ): Promise<object> {
    const { _id }: any = req.user;
    const date: number = this.publicService.getCurrentDate();
    const daily_routine: DailyRoutine = {
      routine_id: uuid.v4(),
      ...dto,
      exercises: [],
    };

    await this.dailyService.findOrCreateDailyForm(_id, date);
    await this.dailyService.createDailyRoutine(_id, date, daily_routine);

    return { message: 'success', data: null };
  }

  @Patch('/routine')
  @ApiOperation({
    summary: '데일리 루틴 수정',
    description: `특정한 루틴을 수정하는 API입니다.`,
  })
  @ApiCookieAuth()
  @ApiOkResponse(api.success.nulldata)
  @ApiBadRequestResponse(api.badRequest)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.mail)
  @UseGuards(VerifyMailGuard)
  async updateDailyRoutine(
    @Req() req: Request,
    @Query() query: UpdateDailyRoutineQueryDto,
    @Body() dto: UpdateDailyRoutineBodyDto,
  ): Promise<object> {
    const { _id }: any = req.user;
    const { date, routine_id } = query;

    await this.dailyService.updateDailyRoutine(_id, date, routine_id, dto);

    return { message: 'success', data: null };
  }

  @Delete('/routine')
  @ApiOperation({
    summary: '데일리 루틴 삭제',
    description: `1. routine_id가 없을 경우 date에 해당하는 전체 루틴을 삭제합니다.
    \n2. routine_id가 있을 경우 date, routine_id에 해당하는 루틴을 삭제합니다.`,
  })
  @ApiCookieAuth()
  @ApiOkResponse(api.success.nulldata)
  @ApiBadRequestResponse(api.badRequest)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.mail)
  @UseGuards(VerifyMailGuard)
  async deleteDailyRoutine(
    @Req() req: Request,
    @Query() query: DeleteDailyRoutineQueryDto,
  ) {
    const { _id }: any = req.user;
    const { date, routine_id } = query;

    if (!routine_id) await this.dailyService.deleteAllDailyRoutine(_id, date);
    else await this.dailyService.deleteOneDailyRoutine(_id, date, routine_id);

    return { message: 'success', data: null };
  }

  @Post('/exercise/:routine_id')
  @ApiOperation({
    summary: '데일리 운동 생성',
    description: `현재 날짜의 특정한 루틴에 새로운 운동을 추가하는 API입니다.`,
  })
  @ApiCookieAuth()
  @ApiCreatedResponse(api.success.nulldata)
  @ApiBadRequestResponse(api.badRequest)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.mail)
  @UseGuards(VerifyMailGuard)
  async createDailyExercise(
    @Req() req: Request,
    @Param('routine_id') routine_id: string,
    @Body() dto: CreateDailyExerciseDto,
  ): Promise<object> {
    const { _id }: any = req.user;
    const date: number = this.publicService.getCurrentDate();

    await this.dailyService.createDailyExercise(_id, date, routine_id, dto);

    return { message: 'success', data: null };
  }

  @Patch('/exercise')
  @ApiOperation({
    summary: '데일리 운동 수정',
    description: `특정한 운동을 수정하는 API입니다.`,
  })
  @ApiCookieAuth()
  @ApiOkResponse(api.success.nulldata)
  @ApiBadRequestResponse(api.badRequest)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.mail)
  @UseGuards(VerifyMailGuard)
  async updateDailyExercise(
    @Req() req: Request,
    @Query() query: UpdateDailyExerciseQueryDto,
    @Body() dto: UpdateDailyExerciseBodyDto,
  ): Promise<object> {
    const { _id }: any = req.user;
    const { date, routine_id, name } = query;

    await this.dailyService.updateDailyExercise(
      _id,
      date,
      routine_id,
      name,
      dto.set,
    );

    return { message: 'success', data: null };
  }

  @Delete('/exercise')
  @ApiOperation({
    summary: '데일리 운동 삭제',
    description: `1. name이 없을 경우 date, routine_id에 해당하는 전체 운동을 삭제합니다.
    \n2. name이 있을 경우 date, routine_id, name에 해당하는 운동을 삭제합니다.`,
  })
  @ApiCookieAuth()
  @ApiOkResponse(api.success.nulldata)
  @ApiBadRequestResponse(api.badRequest)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.mail)
  @UseGuards(VerifyMailGuard)
  async deleteDailyExercise(
    @Req() req: Request,
    @Query() query: DeleteDailyExerciseQueryDto,
  ) {
    const { _id }: any = req.user;
    const { date, routine_id, name } = query;

    if (!name)
      await this.dailyService.deleteAllDailyExercise(_id, date, routine_id);
    else
      await this.dailyService.deleteOneDailyExercise(
        _id,
        date,
        routine_id,
        name,
      );

    return { message: 'success', data: null };
  }
}
