import {
  Body,
  ConflictException,
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
import { Request } from 'express';
import { VerifyMailGuard } from 'src/auth/guards/verify-mail.guard';
import { ExerciseInfo } from 'src/exercise/interfaces/exercise-info.interface';
import { CustomizedExerciseService } from './customized-exercise.service';
import { CreateCustomizedExerciseDto } from './dto/create-customized-exercise.dto';
import { FindCustomizedExerciseDto } from './dto/find-customized-exercise.dto';
import { UpdateCustomizedExerciseDto } from './dto/update-customized-exercise.dto';

@Controller('customized-exercise')
export class CustomizedExerciseController {
  constructor(
    private readonly customizedExerciseService: CustomizedExerciseService,
  ) {}

  @Get()
  @UseGuards(VerifyMailGuard)
  async findExercise(
    @Req() req: Request,
    @Query() dto: FindCustomizedExerciseDto,
  ): Promise<ExerciseInfo | ExerciseInfo[]> {
    const { e_mail }: any = req.user;
    const { exercise_name, target } = dto;

    if (!exercise_name && !target)
      return await this.customizedExerciseService.findAllExercise(e_mail);
    else if ((exercise_name && target) || exercise_name)
      return await this.customizedExerciseService.findOneExerciseByName(
        e_mail,
        exercise_name,
      );
    else
      return await this.customizedExerciseService.findAllExerciseByTarget(
        e_mail,
        target,
      );
  }

  @Post()
  @UseGuards(VerifyMailGuard)
  async createExercise(
    @Req() req: Request,
    @Body() dto: CreateCustomizedExerciseDto,
  ): Promise<object> {
    const { e_mail }: any = req.user;

    try {
      await this.customizedExerciseService.findOneExerciseByName(
        e_mail,
        dto.exercise_name,
      );
    } catch {
      await this.customizedExerciseService.createExercise(e_mail, dto);
      return { message: 'success', data: null };
    }

    throw new ConflictException(
      `Existing customized-exercise:${dto.exercise_name}`,
    );
  }

  @Patch('/:exercise_name')
  @UseGuards(VerifyMailGuard)
  async updateOneExercise(
    @Req() req: Request,
    @Param('exercise_name') exercise_name: string,
    @Body() dto: UpdateCustomizedExerciseDto,
  ): Promise<object> {
    const { e_mail }: any = req.user;

    await this.customizedExerciseService.updateOneExercise(
      e_mail,
      exercise_name,
      dto,
    );
    return { message: 'success', data: null };
  }

  @Delete('/:exercise_name')
  @UseGuards(VerifyMailGuard)
  async deleteOneExercise(
    @Req() req: Request,
    @Param('exercise_name') exercise_name: string,
  ): Promise<object> {
    const { e_mail }: any = req.user;

    await this.customizedExerciseService.deleteOneExercise(
      e_mail,
      exercise_name,
    );
    return { message: 'success', data: null };
  }
}
