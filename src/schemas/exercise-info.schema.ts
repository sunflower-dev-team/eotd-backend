import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExerciseInfoDocument = ExerciseInfo & Document;

@Schema({ collection: 'ExerciseInfo', versionKey: false })
export class ExerciseInfo {
  @Prop()
  chest_exercises: string[];

  @Prop()
  shoulder_exercises: string[];

  @Prop()
  back_exercises: string[];

  @Prop()
  lower_body_exercises: string[];

  @Prop()
  arm_exercises: string[];

  @Prop()
  exercise_description: string;

  @Prop()
  exercise_links: string[];

  @Prop()
  first_aid: string[];
}

export const ExerciseInfoSchema = SchemaFactory.createForClass(ExerciseInfo);
