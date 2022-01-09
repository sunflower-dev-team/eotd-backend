import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DailyExerciseDocument = DailyExercise & Document;

@Schema({ collection: 'daily_exercise', versionKey: false, _id: false })
export class DailyExercise {
  @Prop({ required: true })
  exercise_id: string;

  @Prop({ required: true })
  exercise_list: string[];

  @Prop()
  exercise_img: string;

  @Prop({ required: true })
  startAt: string;

  @Prop({ required: true })
  endAt: string;
}

export const DailyExerciseSchema = SchemaFactory.createForClass(DailyExercise);
