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

  // C-daily
  async findOrCreateDaliyForm(e_mail: string, date: number): Promise<void> {
    const dailyForm: Daily = await this.dailyModel.findOne({
      e_mail,
      date,
    });
    if (!dailyForm)
      await this.dailyModel.create({ e_mail, date }).catch(() => {
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

  // R-daily
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

  // U-daily
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
      throw new NotFoundException('There is no daily for that date');
    else if (
      !previousDaily.daily_diet.filter(
        (dietInfo) => dietInfo.diet_id === diet_id,
      ).length
    )
      throw new NotFoundException(`No exist diet_id:${diet_id}`);
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
      throw new NotFoundException('There is no daily for that date');
    else if (
      !previousDaily.daily_exercise.filter(
        (exerciseInfo) => exerciseInfo.exercise_id === exercise_id,
      ).length
    )
      throw new NotFoundException(`No exist exercise_id:${exercise_id}`);
    return;
  }

  // D-daily
  async deleteDaily(e_mail: string): Promise<void> {
    await this.dailyModel.deleteMany({ e_mail }).catch(() => {
      throw new InternalServerErrorException(
        `${e_mail}'s daily-list has not been deleted`,
      );
    });
    return;
  }

  async deleteAllDailyDiet(e_mail: string, date: number): Promise<void> {
    const previousDaily = await this.dailyModel
      .findOneAndUpdate({ e_mail, date }, { daily_diet: [] })
      .catch(() => {
        throw new InternalServerErrorException(
          'Daily_diet datas has not been deleted',
        );
      });

    if (!previousDaily)
      throw new NotFoundException('There is no daily for that date');
    else if (!previousDaily.daily_diet.length)
      throw new NotFoundException(`No exist diet datas`);
    return;
  }

  async deleteOneDailyDiet(
    e_mail: string,
    date: number,
    diet_id: string,
  ): Promise<void> {
    const previousDaily = await this.dailyModel
      .findOneAndUpdate(
        { e_mail, date },
        { $pull: { daily_diet: { diet_id } } },
      )
      .catch(() => {
        throw new InternalServerErrorException(
          `Daily_diet:${diet_id} has not been deleted`,
        );
      });

    if (!previousDaily)
      throw new NotFoundException('There is no daily for that date');
    else if (
      !previousDaily.daily_diet.filter(
        (dietInfo) => dietInfo.diet_id === diet_id,
      ).length
    )
      throw new NotFoundException(`No exist diet_id:${diet_id}`);
    return;
  }

  async deleteAllDailyExercise(e_mail: string, date: number): Promise<void> {
    const previousDaily = await this.dailyModel
      .findOneAndUpdate({ e_mail, date }, { daily_exercise: [] })
      .catch(() => {
        throw new InternalServerErrorException(
          'Daily_exercise datas has not been deleted',
        );
      });

    if (!previousDaily)
      throw new NotFoundException('There is no daily for that date');
    else if (!previousDaily.daily_exercise.length)
      throw new NotFoundException(`No exist diet datas`);
    return;
  }

  async deleteOneDailyExercise(
    e_mail: string,
    date: number,
    exercise_id: string,
  ): Promise<void> {
    const previousDaily = await this.dailyModel
      .findOneAndUpdate(
        { e_mail, date },
        { $pull: { daily_exercise: { exercise_id } } },
      )
      .catch(() => {
        throw new InternalServerErrorException(
          `Daily_exercise:${exercise_id} has not been deleted`,
        );
      });

    if (!previousDaily)
      throw new NotFoundException('There is no daily for that date');
    else if (
      !previousDaily.daily_exercise.filter(
        (exerciseInfo) => exerciseInfo.exercise_id === exercise_id,
      ).length
    )
      throw new NotFoundException(`No exist exercise_id:${exercise_id}`);
    return;
  }
}
