import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateExerciseDto } from 'src/exercise/dto/create-exercise.dto';
import { UpdateExerciseDto } from 'src/exercise/dto/update-exercise.dto';
import {
  CustomizedExercise,
  CustomizedExerciseDocument,
} from 'src/schemas/customized-exercise.schema';
import { Exercise } from 'src/schemas/exercise.schema';

@Injectable()
export class CustomizedExerciseService {
  constructor(
    @InjectModel(CustomizedExercise.name)
    private customizedExerciseModel: Model<CustomizedExerciseDocument>,
  ) {}

  // C

  async createExercise(
    e_mail: string,
    exerciseInfo: CreateExerciseDto,
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

  async findAllExercise(e_mail: string): Promise<Exercise[]> {
    const exerciseList: Exercise[] = await this.customizedExerciseModel
      .find({ e_mail })
      .select({ _id: 0, e_mail: 0 });

    if (!exerciseList.length)
      throw new NotFoundException('No exist customized-exercises');
    return exerciseList;
  }

  async findAllExerciseByTarget(
    e_mail: string,
    target: string,
  ): Promise<Exercise[]> {
    const exerciseList: Exercise[] = await this.customizedExerciseModel
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
  ): Promise<Exercise> {
    const exerciseInfo: Exercise = await this.customizedExerciseModel
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
    exerciseInfo: UpdateExerciseDto,
  ): Promise<void> {
    const previousExercise: Exercise = await this.customizedExerciseModel
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
    const previousExercise: Exercise = await this.customizedExerciseModel
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
