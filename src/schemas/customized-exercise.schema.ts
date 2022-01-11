import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomizedExerciseDocument = CustomizedExercise & Document;

@Schema({ collection: 'customized_exercise', versionKey: false })
export class CustomizedExercise {
  @Prop({ required: true })
  e_mail: string;

  @Prop({ required: true })
  exercise_name: string;

  @Prop({ required: true })
  target: string;

  @Prop()
  description: string;

  @Prop()
  links: string[];

  @Prop()
  first_aid: string[];
}

export const CustomizedExerciseSchema =
  SchemaFactory.createForClass(CustomizedExercise);
CustomizedExerciseSchema.index(
  { e_mail: 1, exercise_name: 1 },
  { unique: true },
);
