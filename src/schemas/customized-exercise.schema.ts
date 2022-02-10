import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Exercise, ExerciseSchema } from './exercise.schema';

export type CustomizedExerciseDocument = CustomizedExercise & Document;

@Schema({ collection: 'customized_exercise', versionKey: false })
export class CustomizedExercise {
  @Prop({ type: Types.ObjectId })
  _id: string;

  @Prop({ type: [ExerciseSchema], required: true })
  exercise_list: Exercise[];
}

export const CustomizedExerciseSchema =
  SchemaFactory.createForClass(CustomizedExercise);
