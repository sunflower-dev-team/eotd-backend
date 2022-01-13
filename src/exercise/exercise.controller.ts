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
import {
  ApiTags,
  ApiParam,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiConflictResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { api } from 'src/swagger';
import { Exercise } from 'src/schemas/exercise.schema';

@Controller('exercise')
@ApiTags('운동 API')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Get()
  @ApiOperation({
    summary: 'EOTD에서 제공하는 운동정보 조회',
    description: `기본적으로 제공되는 운동정보를 조회하는 API입니다.
    \n1. exercise_name 으로만 조회하는 경우 해당 이름을 가진 운동을 조회합니다.[객체 데이터]
    \n2. target 으로만 조회하는 경우 해당 부위의 운동들을 조회합니다.[배열 데이터]
    \n3. exercise_name 와 target 둘다 있을 경우 해당 이름을 가진 운동을 조회합니다.[객체 데이터]
    \n4. 어떠한 쿼리도 없을 경우 모든 운동들을 조회합니다.[배열 데이터]`,
  })
  @ApiOkResponse(api.success.exercise)
  @ApiBadRequestResponse(api.badRequest)
  @ApiNotFoundResponse(api.notFound.exercise)
  async findExercise(@Query() dto: FindExerciseDto): Promise<object> {
    const { exercise_name, target } = dto;
    let exerciseOrExercises: Exercise[] | Exercise;
    if (!exercise_name && !target)
      exerciseOrExercises = await this.exerciseService.findAllExercise();
    else if ((exercise_name && target) || exercise_name)
      exerciseOrExercises = await this.exerciseService.findOneExerciseByName(
        exercise_name,
      );
    else
      exerciseOrExercises = await this.exerciseService.findAllExerciseByTarget(
        target,
      );

    return { message: 'success', data: exerciseOrExercises };
  }

  @Post()
  @ApiOperation({
    summary: '운동 생성',
    description: '새로운 운동 정보를 생성하는 API입니다.',
  })
  @ApiCookieAuth()
  @ApiCreatedResponse(api.success.nulldata)
  @ApiBadRequestResponse(api.badRequest)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.admin)
  @ApiConflictResponse(api.conflict.exercise)
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
  @ApiOperation({
    summary: '운동 수정',
    description: '해당 이름을 가진 운동 정보를 수정하는 API입니다.',
  })
  @ApiCookieAuth()
  @ApiParam({
    name: 'exercise_name',
    description: '운동 이름',
    example: '벤치프레스',
  })
  @ApiCreatedResponse(api.success.nulldata)
  @ApiBadRequestResponse(api.badRequest)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.admin)
  @ApiNotFoundResponse(api.notFound.exercise)
  @UseGuards(AdminGuard)
  async updateExercise(
    @Param('exercise_name') exercise_name: string,
    @Body() dto: UpdateExerciseDto,
  ): Promise<object> {
    await this.exerciseService.updateOneExercise(exercise_name, dto);
    return { message: 'success', data: null };
  }

  @Delete('/:exercise_name')
  @ApiOperation({
    summary: '운동 삭제',
    description: '해당 이름을 가진 운동 정보를 삭제하는 API입니다.',
  })
  @ApiCookieAuth()
  @ApiParam({
    name: 'exercise_name',
    description: '운동 이름',
    example: '벤치프레스',
  })
  @ApiCreatedResponse(api.success.nulldata)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.admin)
  @ApiNotFoundResponse(api.notFound.exercise)
  @UseGuards(AdminGuard)
  async deleteExercise(
    @Param('exercise_name') exercise_name: string,
  ): Promise<object> {
    await this.exerciseService.deleteOneExercise(exercise_name);
    return { message: 'success', data: null };
  }
}
