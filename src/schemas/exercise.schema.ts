import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExerciseDocument = Exercise & Document;

@Schema({ collection: 'exercise', versionKey: false })
export class Exercise {
  @Prop({ required: true, unique: true })
  exercise_name: string;

  @Prop({ required: true, index: true })
  target: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  links: string[];

  @Prop({ required: true })
  first_aid: string[];
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
