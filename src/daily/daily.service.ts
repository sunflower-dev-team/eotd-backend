import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Daily, DailyDocument } from 'src/schemas/daily.schema';
import { DailyDietInfo } from 'src/daily/interfaces/daily-diet-info.interface';
import { DailyExerciseInfo } from 'src/daily/interfaces/daily-exercise-info.interface';
import { UpdateDailyDietBodyDto } from './dto/update-daily-diet.dto';
import { UpdateDailyExerciseBodyDto } from './dto/update-daily-exercise.dto';

@Injectable()
export class DailyService {
  constructor(
    @InjectModel(Daily.name) private dailyModel: Model<DailyDocument>,
  ) {}

  // Create

  async findAndCreateDaliyForm(e_mail: string, date: number): Promise<void> {
    const dailyForm: Daily | null = await this.dailyModel.findOne({
      date,
      e_mail,
    });
    if (!dailyForm)
      await this.dailyModel.create({ e_mail }).catch(() => {
        throw new InternalServerErrorException(
          'Daily-document has not been created',
        );
      });
    return;
  }

  async createDailyDiet(
    e_mail: string,
    date: number,
    daily_diet: DailyDietInfo,
  ): Promise<void> {
    await this.dailyModel
      .updateOne(
        { e_mail, date },
        { $push: { daily_diet } },
        { runValidators: true },
      )
      .catch(() => {
        throw new InternalServerErrorException(
          'Daily-diet-subDocument has not been created',
        );
      });
    return;
  }

  async createDailyExercise(
    e_mail: string,
    date: number,
    daily_exercise: DailyExerciseInfo,
  ): Promise<void> {
    await this.dailyModel
      .updateOne(
        { e_mail, date },
        { $push: { daily_exercise } },
        { runValidators: true },
      )
      .catch(() => {
        throw new InternalServerErrorException(
          'Daily-exercise-subDocument has not been created',
        );
      });
    return;
  }

  // Read

  async findAllDaily(e_mail: string): Promise<Daily[]> {
    const dailyInfoList: Daily[] = await this.dailyModel
      .find({ e_mail })
      .select({ _id: 0 });
    if (!dailyInfoList.length)
      throw new NotFoundException('No exist dailyInfoList');
    return dailyInfoList;
  }

  async findOneDaily(e_mail: string, date: number): Promise<Daily> {
    const dailyInfo: Daily | null = await this.dailyModel
      .findOne({
        e_mail,
        date,
      })
      .select({ _id: 0 });
    if (!dailyInfo)
      throw new NotFoundException(
        'There is no info corresponding to that date',
      );
    return dailyInfo;
  }

  // Update

  async updateOneDailyDiet(
    e_mail: string,
    date: number,
    diet_id: string,
    dietInfo: UpdateDailyDietBodyDto,
  ): Promise<void> {
    const setForm: object = {};

    for (const key in dietInfo) setForm[`daily_diet.$.${key}`] = dietInfo[key];

    const previousDaily = await this.dailyModel
      .findOneAndUpdate(
        {
          e_mail,
          date,
          'daily_diet.diet_id': diet_id,
        },
        {
          $set: setForm,
        },
        { runValidators: true },
      )
      .catch(() => {
        throw new InternalServerErrorException(
          'Daily_diet has not been updated',
        );
      });

    if (!previousDaily)
      throw new NotFoundException('No exist daily or diet_id');
    return;
  }

  async updateOneDailyExercise(
    e_mail: string,
    date: number,
    exercise_id: string,
    exerciseInfo: UpdateDailyExerciseBodyDto,
  ): Promise<void> {
    const setForm: object = {};

    for (const key in exerciseInfo)
      setForm[`daily_exercise.$.${key}`] = exerciseInfo[key];

    const previousDaily = await this.dailyModel
      .findOneAndUpdate(
        {
          e_mail,
          date,
          'daily_exercise.exercise_id': exercise_id,
        },
        {
          $set: setForm,
        },
        { runValidators: true },
      )
      .catch(() => {
        throw new InternalServerErrorException(
          'Daily_exercise has not been updated',
        );
      });

    if (!previousDaily)
      throw new NotFoundException('No exist daily or exercise_id');
    return;
  }

  // Delete
  async deleteAllDailyDiet(e_mail: string, date: number): Promise<void> {
    const previousDaily = await this.dailyModel
      .findOneAndUpdate(
        { e_mail, date, 'daily_diet.diet_id': { $exists: true } },
        { $pull: { daily_diet: { diet_id: { $exists: true } } } },
      )
      .catch(() => {
        throw new InternalServerErrorException(
          'Daily_diet datas has not been deleted',
        );
      });

    if (!previousDaily) throw new NotFoundException(`No exist diet datas`);
    return;
  }

  async deleteOneDailyDiet(
    e_mail: string,
    date: number,
    diet_id: string,
  ): Promise<void> {
    const previousDaily = await this.dailyModel
      .findOneAndUpdate(
        { e_mail, date, 'daily_diet.diet_id': diet_id },
        { $pull: { daily_diet: { diet_id } } },
      )
      .catch(() => {
        throw new InternalServerErrorException(
          `Daily_diet:${diet_id} has not been deleted`,
        );
      });

    if (!previousDaily)
      throw new NotFoundException(`No exist diet_id:${diet_id}`);
    return;
  }

  async deleteAllDailyExercise(e_mail: string, date: number): Promise<void> {
    const previousDaily = await this.dailyModel
      .findOneAndUpdate(
        { e_mail, date, 'daily_exercise.exercise_id': { $exists: true } },
        { $pull: { daily_exercise: { exercise_id: { $exists: true } } } },
      )
      .catch(() => {
        throw new InternalServerErrorException(
          'Daily_exercise datas has not been deleted',
        );
      });

    if (!previousDaily) throw new NotFoundException(`No exist exercise datas`);
    return;
  }

  async deleteOneDailyExercise(
    e_mail: string,
    date: number,
    exercise_id: string,
  ): Promise<void> {
    const previousDaily = await this.dailyModel
      .findOneAndUpdate(
        { e_mail, date, 'daily_exercise.exercise_id': exercise_id },
        { $pull: { daily_exercise: { exercise_id } } },
      )
      .catch(() => {
        throw new InternalServerErrorException(
          `Daily_exercise:${exercise_id} has not been deleted`,
        );
      });

    if (!previousDaily)
      throw new NotFoundException(`No exist exercise_id:${exercise_id}`);
    return;
  }
}
