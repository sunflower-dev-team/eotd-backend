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
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { FindExerciseDto } from './dto/find-exercise-dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ExerciseService } from './exercise.service';
import { ExerciseInfo } from './interfaces/exercise-info.interface';

@Controller('exercise')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Get()
  async findExercise(
    @Query() dto: FindExerciseDto,
  ): Promise<ExerciseInfo[] | ExerciseInfo> {
    const { exercise_name, target } = dto;
    if (!exercise_name && !target)
      return await this.exerciseService.findAllExercise();
    else if ((exercise_name && target) || exercise_name)
      return await this.exerciseService.findOneExerciseByName(exercise_name);
    else return await this.exerciseService.findAllExerciseByTarget(target);
  }

  @Post()
  @UseGuards(AdminGuard)
  async createExercise(@Body() dto: CreateExerciseDto): Promise<object> {
    try {
      await this.exerciseService.findOneExerciseByName(dto.exercise_name);
    } catch {
      await this.exerciseService.createExercise(dto);
      return { message: 'success', data: null };
    }
    throw new ConflictException(`Existing exercise:${dto.exercise_name}`);
  }

  @Patch('/:exercise_name')
  @UseGuards(AdminGuard)
  async updateExercise(
    @Param('exercise_name') exercise_name: string,
    @Body() dto: UpdateExerciseDto,
  ): Promise<object> {
    await this.exerciseService.updateOneExercise(exercise_name, dto);
    return { message: 'success', data: null };
  }

  @Delete('/:exercise_name')
  @UseGuards(AdminGuard)
  async deleteExercise(
    @Param('exercise_name') exercise_name: string,
  ): Promise<object> {
    await this.exerciseService.deleteOneExercise(exercise_name);
    return { message: 'success', data: null };
  }
}
