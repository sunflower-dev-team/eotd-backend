import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Exercise, ExerciseSchema } from './exercise.schema';

export type CustomizedExerciseDocument = CustomizedExercise & Document;

@Schema({ collection: 'customized_exercise', versionKey: false })
export class CustomizedExercise {
  @Prop({ unique: true, required: true })
  e_mail: string;

  @Prop({ type: [ExerciseSchema], required: true })
  exercise_list: Exercise[];
}

export const CustomizedExerciseSchema =
  SchemaFactory.createForClass(CustomizedExercise);
