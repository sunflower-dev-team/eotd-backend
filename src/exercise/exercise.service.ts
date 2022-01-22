import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Exercise, ExerciseDocument } from 'src/schemas/exercise.schema';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectModel(Exercise.name) private exerciseModel: Model<ExerciseDocument>,
  ) {}

  // C

  async createExercise(
    exerciseInfo: CreateExerciseDto | CreateExerciseDto[],
  ): Promise<void> {
    const isCreateMany = Array.isArray(exerciseInfo);

    await this.exerciseModel.create(exerciseInfo).catch(() => {
      if (!isCreateMany)
        throw new InternalServerErrorException(
          `${exerciseInfo.exercise_name} has not been created`,
        );
      throw new InternalServerErrorException('Exercises has not been created');
    });
    return;
  }

  // R

  async findAllExercise(): Promise<Exercise[]> {
    const exerciseList: Exercise[] = await this.exerciseModel
      .find()
      .select({ _id: 0 });
    if (!exerciseList.length) throw new NotFoundException('No exist exercises');
    return exerciseList;
  }

  async findAllExerciseByTarget(target: string): Promise<Exercise[]> {
    const exerciseList: Exercise[] = await this.exerciseModel
      .find({ target })
      .select({ _id: 0 });
    if (!exerciseList.length)
      throw new NotFoundException(`No exist exercises:${target}`);
    return exerciseList;
  }

  async findOneExerciseByName(exercise_name: string): Promise<Exercise> {
    const exerciseInfo: Exercise = await this.exerciseModel
      .findOne({ exercise_name })
      .select({ _id: 0 });
    if (!exerciseInfo)
      throw new NotFoundException(`No exist exercise:${exercise_name}`);
    return exerciseInfo;
  }

  // U

  async updateOneExercise(
    exercise_name: string,
    exerciseInfo: UpdateExerciseDto,
  ): Promise<void> {
    const previousExercise: Exercise = await this.exerciseModel
      .findOneAndUpdate({ exercise_name }, exerciseInfo)
      .select({ _id: 0 })
      .catch(() => {
        throw new InternalServerErrorException('Exercise has not been updated');
      });
    if (!previousExercise)
      throw new NotFoundException(`No exist exercise:${exercise_name}`);
    return;
  }

  // D

  async deleteOneExercise(exercise_name: string): Promise<void> {
    const previousExercise: Exercise = await this.exerciseModel
      .findOneAndDelete({
        exercise_name,
      })
      .select({ _id: 0 })
      .catch(() => {
        throw new InternalServerErrorException('Exercise has not been deleted');
      });
    if (!previousExercise)
      throw new NotFoundException(`No exist exercise:${exercise_name}`);
    return;
  }
}
