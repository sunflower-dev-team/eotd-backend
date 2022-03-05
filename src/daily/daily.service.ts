import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Daily, Dailys, DailysDocument } from 'src/schemas/daily.schema';
import { UpdateDailyDietBodyDto } from './dto/update-daily-diet.dto';
import { UpdateDailyRoutineBodyDto } from './dto/update-daily-routine.dto';
import {
  CreateDailyExerciseDto,
  ExerciseSetInfo,
} from './dto/create-daily-exercise.dto';
import { DailyDiet } from 'src/schemas/daily-diet.schema';
import { DailyRoutine } from 'src/schemas/daily-routine.schema';

@Injectable()
export class DailyService {
  constructor(
    @InjectModel(Dailys.name) private dailysModel: Model<DailysDocument>,
  ) {}

  // Daily - C,R,D
  async createDaily(_id: string): Promise<void> {
    await this.dailysModel.create({ _id, dailys: [] }).catch(() => {
      throw new InternalServerErrorException(
        'Daily-document has not been created',
      );
    });
    return;
  }

  async findOrCreateDailyForm(_id: string, date: number): Promise<void> {
    const dailys = await this.dailysModel.findOne({
      _id,
      dailys: { $elemMatch: { date } },
    });

    if (!dailys) {
      await this.dailysModel.findByIdAndUpdate(_id, {
        $push: { dailys: { date } },
      });
    }
    return;
  }

  async findDailys(_id: string): Promise<Dailys> {
    const dailys = await this.dailysModel.findById(_id);

    if (!dailys.dailys.length)
      throw new NotFoundException('No exist daily anything');
    return dailys;
  }

  async findDaily(_id: string, date: number): Promise<Daily> {
    const dailys = await this.dailysModel.findById(_id, {
      dailys: { $elemMatch: { date } },
    });

    if (!dailys.dailys[0])
      throw new NotFoundException(
        'There is no info corresponding to that date',
      );
    return dailys.dailys[0];
  }

  async deleteDaily(_id: string, date: number): Promise<void> {
    await this.dailysModel
      .findByIdAndUpdate(
        _id,
        { $pull: { dailys: { date } } },
        { runValidators: true },
      )
      .catch(() => {
        throw new InternalServerErrorException(
          `user's daily-list has not been deleted`,
        );
      });
    return;
  }

  async deleteDailys(_id: string): Promise<void> {
    await this.dailysModel.findByIdAndDelete(_id).catch(() => {
      throw new InternalServerErrorException(
        `user's daily-list has not been deleted`,
      );
    });
    return;
  }

  // Diet - C,U,D
  async createDailyDiet(
    _id: string,
    date: number,
    daily_diet: DailyDiet,
  ): Promise<void> {
    await this.dailysModel.findByIdAndUpdate(
      _id,
      { $push: { 'dailys.$[daily].daily_diet': daily_diet } },
      {
        runValidators: true,
        arrayFilters: [{ 'daily.date': date }],
      },
    );
    return;
  }

  async updateDailyDiet(
    _id: string,
    date: number,
    diet_id: string,
    dietInfo: UpdateDailyDietBodyDto,
  ): Promise<void> {
    const setForm: object = {};

    for (const key in dietInfo)
      setForm[`dailys.$[daily].daily_diet.$[diet].${key}`] = dietInfo[key];

    await this.dailysModel
      .findByIdAndUpdate(
        _id,
        {
          $set: setForm,
        },
        {
          runValidators: true,
          arrayFilters: [{ 'daily.date': date }, { 'diet.diet_id': diet_id }],
        },
      )
      .catch(() => {
        throw new InternalServerErrorException(
          'Daily_diet has not been updated',
        );
      });
    return;
  }

  async deleteAllDailyDiet(_id: string, date: number): Promise<void> {
    await this.dailysModel
      .findByIdAndUpdate(
        _id,
        { 'dailys.$[daily].daily_diet': [] },
        { runValidators: true, arrayFilters: [{ 'daily.date': date }] },
      )
      .catch(() => {
        throw new InternalServerErrorException(
          'Daily_diet datas has not been deleted',
        );
      });
    return;
  }

  async deleteOneDailyDiet(
    _id: string,
    date: number,
    diet_id: string,
  ): Promise<void> {
    await this.dailysModel
      .findByIdAndUpdate(
        _id,
        {
          $pull: { 'dailys.$[daily].daily_diet': { diet_id } },
        },
        { runValidators: true, arrayFilters: [{ 'daily.date': date }] },
      )
      .catch(() => {
        throw new InternalServerErrorException(
          `Daily_diet:${diet_id} has not been deleted`,
        );
      });
    return;
  }

  // Routine - C,U,D
  async createDailyRoutine(
    _id: string,
    date: number,
    daily_routine: DailyRoutine,
  ): Promise<void> {
    await this.dailysModel.findByIdAndUpdate(
      _id,
      { $push: { 'dailys.$[daily].daily_routine': daily_routine } },
      { runValidators: true, arrayFilters: [{ 'daily.date': date }] },
    );
    return;
  }

  async updateDailyRoutine(
    _id: string,
    date: number,
    routine_id: string,
    daily_routine: UpdateDailyRoutineBodyDto,
  ): Promise<void> {
    const setForm: object = {};

    for (const key in daily_routine)
      setForm[`dailys.$[daily].daily_routine.$[routine].${key}`] =
        daily_routine[key];

    await this.dailysModel
      .findByIdAndUpdate(
        _id,
        {
          $set: setForm,
        },
        {
          runValidators: true,
          arrayFilters: [
            { 'daily.date': date },
            { 'routine.routine_id': routine_id },
          ],
        },
      )
      .catch(() => {
        throw new InternalServerErrorException(
          'Daily_exercise has not been updated',
        );
      });
    return;
  }

  async deleteAllDailyRoutine(_id: string, date: number): Promise<void> {
    await this.dailysModel
      .findByIdAndUpdate(
        _id,
        { 'dailys.$[daily].daily_routine': [] },
        { runValidators: true, arrayFilters: [{ 'daily.date': date }] },
      )
      .catch(() => {
        throw new InternalServerErrorException(
          'Daily_exercise datas has not been deleted',
        );
      });
    return;
  }

  async deleteOneDailyRoutine(
    _id: string,
    date: number,
    routine_id: string,
  ): Promise<void> {
    await this.dailysModel
      .findByIdAndUpdate(
        _id,
        { $pull: { 'dailys.$[daily].daily_routine': { routine_id } } },
        { runValidators: true, arrayFilters: [{ 'daily.date': date }] },
      )
      .catch(() => {
        throw new InternalServerErrorException(
          'Daily_exercise datas has not been deleted',
        );
      });
    return;
  }

  // Exercise - C,U,D
  async createDailyExercise(
    _id: string,
    date: number,
    routine_id: string,
    daily_exercise: CreateDailyExerciseDto,
  ): Promise<void> {
    await this.dailysModel
      .findByIdAndUpdate(
        _id,
        {
          $push: {
            'dailys.$[daily].daily_routine.$[routine].exercises': {
              name: daily_exercise.name,
              set: daily_exercise.set,
            },
          },
        },
        {
          runValidators: true,
          arrayFilters: [
            {
              'daily.date': date,
            },
            {
              'routine.routine_id': routine_id,
            },
          ],
        },
      )
      .catch(() => {
        throw new BadRequestException(
          `[count] and [kg] are essential when a [set]column exists.`,
        );
      });
    return;
  }

  async updateDailyExercise(
    _id: string,
    date: number,
    routine_id: string,
    name: string,
    set: ExerciseSetInfo,
  ): Promise<void> {
    await this.dailysModel
      .findByIdAndUpdate(
        _id,
        {
          'dailys.$[daily].daily_routine.$[routine].exercises.$[exercise]': {
            name,
            set,
          },
        },
        {
          runValidators: true,
          arrayFilters: [
            {
              'daily.date': date,
            },
            {
              'routine.routine_id': routine_id,
            },
            { 'exercise.name': name },
          ],
        },
      )
      .catch(() => {
        throw new BadRequestException(
          `[count] and [kg] are essential when a [set]column exists.`,
        );
      });
    return;
  }

  async deleteAllDailyExercise(
    _id: string,
    date: number,
    routine_id: string,
  ): Promise<void> {
    await this.dailysModel
      .findByIdAndUpdate(
        _id,
        {
          'dailys.$[daily].daily_routine.$[routine].exercises': [],
        },
        {
          runValidators: true,
          arrayFilters: [
            { 'daily.date': date },
            { 'routine.routine_id': routine_id },
          ],
        },
      )
      .catch(() => {
        throw new InternalServerErrorException(
          'Daily_exercise datas has not been deleted',
        );
      });
    return;
  }

  async deleteOneDailyExercise(
    _id: string,
    date: number,
    routine_id: string,
    name: string,
  ): Promise<void> {
    await this.dailysModel
      .findByIdAndUpdate(
        _id,
        {
          $pull: {
            'dailys.$[daily].daily_routine.$[routine].exercises': {
              name,
            },
          },
        },
        {
          runValidators: true,
          arrayFilters: [
            { 'daily.date': date },
            { 'routine.routine_id': routine_id },
          ],
        },
      )
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(
          `Daily_exercise:${name} has not been deleted`,
        );
      });
    return;
  }
}
