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

  // C-customized-exercise
  async createCustomizedExerciseForm(e_mail: string): Promise<void> {
    await this.customizedExerciseModel.create({ e_mail }).catch(() => {
      throw new InternalServerErrorException(
        'Customized-Exercise-document has not been created',
      );
    });
    return;
  }

  async createExercise(
    e_mail: string,
    exerciseInfo: CreateExerciseDto,
  ): Promise<void> {
    await this.customizedExerciseModel
      .findOneAndUpdate(
        { e_mail },
        { $push: { exercise_list: exerciseInfo } },
        { runValidators: true },
      )
      .catch(() => {
        throw new InternalServerErrorException(
          `${exerciseInfo.exercise_name} has not been created`,
        );
      });
    return;
  }

  // R-customized-exercise
  async findOneOrAllExercise(
    e_mail: string,
    exercise_name: string | null,
  ): Promise<Exercise | Exercise[]> {
    const userCustomized: CustomizedExercise =
      await this.customizedExerciseModel
        .findOne({ e_mail })
        .select({ _id: 0, 'exercise_list._id': 0 });

    if (!userCustomized.exercise_list.length)
      throw new NotFoundException('No exist customized-exercises');
    else if (!exercise_name) return userCustomized.exercise_list;

    const exerciseInfo = userCustomized.exercise_list.filter(
      (info) => info.exercise_name === exercise_name,
    )[0];

    if (!exerciseInfo) throw new NotFoundException(`No exist ${exercise_name}`);
    return exerciseInfo;
  }

  // U-customized-exercise
  async updateOneExercise(
    e_mail: string,
    exercise_name: string,
    exerciseInfo: UpdateExerciseDto,
  ): Promise<void> {
    const setForm: object = {};

    for (const key in exerciseInfo)
      setForm[`exercise_list.$.${key}`] = exerciseInfo[key];

    const previousExercise: CustomizedExercise =
      await this.customizedExerciseModel
        .findOneAndUpdate(
          {
            e_mail,
            'exercise_list.exercise_name': exercise_name,
          },
          { $set: setForm },
        )
        .select({ _id: 0 })
        .catch(() => {
          throw new InternalServerErrorException(
            'Customized-Exercise has not been updated',
          );
        });
    if (!previousExercise)
      throw new NotFoundException(
        `No exist customized-exercise:${exercise_name}`,
      );
    return;
  }

  // D-customized-exercise
  async deleteAllExercise(e_mail: string): Promise<void> {
    await this.customizedExerciseModel
      .findOneAndUpdate({ e_mail }, { exercise_list: [] })
      .catch(() => {
        throw new InternalServerErrorException(
          'Exercises has not been deleted',
        );
      });
    return;
  }

  async deleteOneExercise(
    e_mail: string,
    exercise_name: string,
  ): Promise<void> {
    const previousExercise: CustomizedExercise =
      await this.customizedExerciseModel
        .findOneAndUpdate(
          {
            e_mail,
          },
          { $pull: { exercise_list: { exercise_name } } },
        )
        .select({ _id: 0 })
        .catch(() => {
          throw new InternalServerErrorException(
            'Customized-Exercise has not been deleted',
          );
        });
    if (!previousExercise)
      throw new NotFoundException(
        `No exist customized-exercise:${exercise_name}`,
      );
    return;
  }
}
