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
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { getCurrentDate } from 'src/functions';
import { DailyDietInfo } from 'src/daily/interfaces/daily-diet-info.interface';
import { DailyService } from './daily.service';
import { CreateDailyDietDto } from './dto/create-daily-diet.dto';
import { CreateDailyExerciseDto } from './dto/create-daily-exercise.dto';
import {
  UpdateDailyDietBodyDto,
  UpdateDailyDietQueryDto,
} from './dto/update-daily-diet.dto';
import * as uuid from 'uuid';
import { DailyExerciseInfo } from 'src/daily/interfaces/daily-exercise-info.interface';
import {
  UpdateDailyExerciseQueryDto,
  UpdateDailyExerciseBodyDto,
} from './dto/update-daily-exercise.dto';

@Controller('daily')
export class DailyController {
  constructor(private readonly dailyService: DailyService) {}

  @Get('/')
  @UseGuards(AuthGuard('jwt'))
  async findAllDaily(@Req() req: Request): Promise<object> {
    const { e_mail }: any = req.user;
    const dailyInfoList = await this.dailyService.findAllDaily(e_mail);

    return { message: 'success', data: dailyInfoList };
  }

  @Get('/:date')
  @UseGuards(AuthGuard('jwt'))
  async findOneDaily(
    @Req() req: Request,
    @Param('date') date: number,
  ): Promise<object> {
    const { e_mail }: any = req.user;
    const dailyInfo = await this.dailyService.findOneDaily(e_mail, date);

    return { message: 'success', data: dailyInfo };
  }

  @Post('/diet')
  @UseGuards(AuthGuard('jwt'))
  async createDailyDiet(
    @Req() req: Request,
    @Body() dto: CreateDailyDietDto,
  ): Promise<object> {
    const { e_mail }: any = req.user;
    const date = getCurrentDate();
    const dietInfo: DailyDietInfo = { diet_id: uuid.v4(), ...dto };

    await this.dailyService.findAndCreateDaliyForm(e_mail, date);
    await this.dailyService.createDailyDiet(e_mail, date, dietInfo);

    return { message: 'success', data: null };
  }

  @Patch('/diet')
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
  async deleteDailyDiet(
    @Req() req: Request,
    @Param('date') date: number,
    @Body('target') target: string,
  ) {
    const { e_mail }: any = req.user;

    if (target.toLowerCase() === 'all')
      await this.dailyService.deleteAllDailyDiet(e_mail, date);
    else await this.dailyService.deleteOneDailyDiet(e_mail, date, target);

    return { message: 'success', data: null };
  }

  @Post('/exercise')
  @UseGuards(AuthGuard('jwt'))
  async createDailyExercise(
    @Req() req: Request,
    @Body() dto: CreateDailyExerciseDto,
  ): Promise<object> {
    const { e_mail }: any = req.user;
    const date: number = getCurrentDate();
    const exerciseInfo: DailyExerciseInfo = { exercise_id: uuid.v4(), ...dto };

    await this.dailyService.findAndCreateDaliyForm(e_mail, date);
    await this.dailyService.createDailyExercise(e_mail, date, exerciseInfo);

    return { message: 'success', data: null };
  }

  @Patch('/exercise')
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
  async deleteDailyExercise(
    @Req() req: Request,
    @Param('date') date: number,
    @Body('target') target: string,
  ): Promise<object> {
    const { e_mail }: any = req.user;

    if (target.toLowerCase() === 'all')
      await this.dailyService.deleteAllDailyExercise(e_mail, date);
    else await this.dailyService.deleteOneDailyExercise(e_mail, date, target);

    return { message: 'success', data: null };
  }
}
