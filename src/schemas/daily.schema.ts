import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { getCurrentDate } from 'src/functions';
import { DailyDiet, DailyDietSchema } from './daily-diet.schema';
import { DailyExercise, DailyExerciseSchema } from './daily-exercise.schema';

export type DailyDocument = Daily & Document;

@Schema({ collection: 'daily', versionKey: false })
export class Daily {
  @Prop({ required: true, default: getCurrentDate() })
  date: number;

  @Prop({ required: true })
  e_mail: string;

  @Prop({ type: [DailyDietSchema], required: true })
  daily_diet: DailyDiet[];

  @Prop({ type: [DailyExerciseSchema], required: true })
  daily_exercise: DailyExercise[];
}

export const DailySchema = SchemaFactory.createForClass(Daily);
DailySchema.index({ e_mail: 1, date: -1 }, { unique: true });
