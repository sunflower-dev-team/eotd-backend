import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExerciseInfo } from 'src/exercise/interfaces/exercise-info.interface';
import {
  CustomizedExercise,
  CustomizedExerciseDocument,
} from 'src/schemas/customized-exercise.schema';
import { CreateCustomizedExerciseDto } from './dto/create-customized-exercise.dto';
import { UpdateCustomizedExerciseDto } from './dto/update-customized-exercise.dto';

@Injectable()
export class CustomizedExerciseService {
  constructor(
    @InjectModel(CustomizedExercise.name)
    private customizedExerciseModel: Model<CustomizedExerciseDocument>,
  ) {}

  // C

  async createExercise(
    e_mail: string,
    exerciseInfo: CreateCustomizedExerciseDto,
  ): Promise<void> {
    await this.customizedExerciseModel
      .create({ e_mail, ...exerciseInfo })
      .catch(() => {
        throw new InternalServerErrorException(
          `${exerciseInfo.exercise_name} has not been created`,
        );
      });
    return;
  }

  // R

  async findAllExercise(e_mail: string): Promise<ExerciseInfo[]> {
    const exerciseList: ExerciseInfo[] = await this.customizedExerciseModel
      .find({ e_mail })
      .select({ _id: 0, e_mail: 0 });

    if (!exerciseList.length)
      throw new NotFoundException('No exist customized-exercises');
    return exerciseList;
  }

  async findAllExerciseByTarget(
    e_mail: string,
    target: string,
  ): Promise<ExerciseInfo[]> {
    const exerciseList: ExerciseInfo[] = await this.customizedExerciseModel
      .find({
        e_mail,
        target,
      })
      .select({ _id: 0, e_mail: 0 });

    if (!exerciseList.length)
      throw new NotFoundException(`No exist customized-exercises:${target}`);
    return exerciseList;
  }

  async findOneExerciseByName(
    e_mail: string,
    exercise_name: string,
  ): Promise<ExerciseInfo> {
    const exerciseInfo: ExerciseInfo = await this.customizedExerciseModel
      .findOne({ e_mail, exercise_name })
      .select({ _id: 0, e_mail: 0 });

    if (!exerciseInfo)
      throw new NotFoundException(
        `No exist customized-exercise:${exercise_name}`,
      );
    return exerciseInfo;
  }

  // U

  async updateOneExercise(
    e_mail: string,
    exercise_name: string,
    exerciseInfo: UpdateCustomizedExerciseDto,
  ): Promise<void> {
    const previousExercise: ExerciseInfo = await this.customizedExerciseModel
      .findOneAndUpdate(
        {
          e_mail,
          exercise_name,
        },
        exerciseInfo,
      )
      .select({ _id: 0, e_mail: 0 })
      .catch(() => {
        throw new InternalServerErrorException('Exercise has not been updated');
      });
    if (!previousExercise)
      throw new NotFoundException(
        `No exist customized-exercise:${exercise_name}`,
      );
    return;
  }

  // D

  async deleteOneExercise(
    e_mail: string,
    exercise_name: string,
  ): Promise<void> {
    const previousExercise: ExerciseInfo = await this.customizedExerciseModel
      .findOneAndDelete({
        e_mail,
        exercise_name,
      })
      .select({ _id: 0, e_mail: 0 })
      .catch(() => {
        throw new InternalServerErrorException('Exercise has not been deleted');
      });
    if (!previousExercise)
      throw new NotFoundException(
        `No exist customized-exercise:${exercise_name}`,
      );
    return;
  }
}
