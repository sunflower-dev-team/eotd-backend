import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { VerifyMailGuard } from 'src/auth/guards/verify-mail.guard';
import { Exercise } from 'src/schemas/exercise.schema';
import { CustomizedExerciseService } from './customized-exercise.service';
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
import { CreateExerciseDto } from 'src/exercise/dto/create-exercise.dto';
import { UpdateExerciseDto } from 'src/exercise/dto/update-exercise.dto';

@Controller('customized-exercise')
@ApiTags('커스텀 운동 API')
export class CustomizedExerciseController {
  constructor(
    private readonly customizedExerciseService: CustomizedExerciseService,
  ) {}

  @Get()
  @ApiOperation({
    summary: '커스텀 운동 조회',
    description: `유저가 커스텀한 운동정보를 조회하는 API입니다.`,
  })
  @ApiCookieAuth()
  @ApiOkResponse(api.success.exercises)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.mail)
  @ApiNotFoundResponse(api.notFound.exercise)
  @UseGuards(VerifyMailGuard)
  async findExercise(@Req() req: Request): Promise<object> {
    const { e_mail }: any = req.user;

    const exerciseList: Exercise | Exercise[] =
      await this.customizedExerciseService.findOneOrAllExercise(e_mail, null);

    return { message: 'success', data: exerciseList };
  }

  @Post()
  @ApiOperation({
    summary: '커스텀 운동 생성',
    description: '새로운 유저의 커스텀 운동 정보를 생성하는 API입니다.',
  })
  @ApiCookieAuth()
  @ApiCreatedResponse(api.success.nulldata)
  @ApiBadRequestResponse(api.badRequest)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.mail)
  @ApiConflictResponse(api.conflict.exercise)
  @UseGuards(VerifyMailGuard)
  async createExercise(
    @Req() req: Request,
    @Body() dto: CreateExerciseDto,
  ): Promise<object> {
    const { e_mail }: any = req.user;

    try {
      await this.customizedExerciseService.findOneOrAllExercise(
        e_mail,
        dto.exercise_name,
      );
    } catch {
      await this.customizedExerciseService.createExercise(e_mail, dto);
      return { message: 'success', data: null };
    }
    throw new ConflictException(`Existing exercise:${dto.exercise_name}`);
  }

  @Patch('/:exercise_name')
  @ApiOperation({
    summary: '커스텀 운동 수정',
    description: '해당 이름을 가진 커스텀 운동 정보를 수정하는 API입니다.',
  })
  @ApiCookieAuth()
  @ApiParam({
    name: 'exercise_name',
    description: '운동 이름',
    example: '벤치프레스',
  })
  @ApiOkResponse(api.success.nulldata)
  @ApiBadRequestResponse(api.badRequest)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.mail)
  @ApiNotFoundResponse(api.notFound.exercise)
  @UseGuards(VerifyMailGuard)
  async updateOneExercise(
    @Req() req: Request,
    @Param('exercise_name') exercise_name: string,
    @Body() dto: UpdateExerciseDto,
  ): Promise<object> {
    const { e_mail }: any = req.user;

    await this.customizedExerciseService.updateOneExercise(
      e_mail,
      exercise_name,
      dto,
    );
    return { message: 'success', data: null };
  }

  @Delete('/')
  @ApiOperation({
    summary: '커스텀 운동 전체 삭제',
    description: '유저가 기록한 모든 커스텀 운동 정보를 삭제하는 API입니다.',
  })
  @ApiCookieAuth()
  @ApiOkResponse(api.success.nulldata)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.mail)
  @UseGuards(VerifyMailGuard)
  async deleteAllExercise(@Req() req: Request): Promise<object> {
    const { e_mail }: any = req.user;

    await this.customizedExerciseService.deleteAllExercise(e_mail);
    return { message: 'success', data: null };
  }

  @Delete('/:exercise_name')
  @ApiOperation({
    summary: '커스텀 운동 삭제',
    description: '해당 이름을 가진 커스텀 운동 정보를 삭제하는 API입니다.',
  })
  @ApiCookieAuth()
  @ApiParam({
    name: 'exercise_name',
    description: '운동 이름',
    example: '벤치프레스',
  })
  @ApiOkResponse(api.success.nulldata)
  @ApiUnauthorizedResponse(api.unauthorized.token)
  @ApiForbiddenResponse(api.forbidden.mail)
  @ApiNotFoundResponse(api.notFound.exercise)
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
