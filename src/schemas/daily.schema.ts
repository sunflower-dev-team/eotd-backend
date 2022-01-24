import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DailyDiet, DailyDietSchema } from './daily-diet.schema';
import { DailyExercise, DailyExerciseSchema } from './daily-exercise.schema';
import { ApiProperty } from '@nestjs/swagger';

export type DailyDocument = Daily & Document;

@Schema({ collection: 'daily', versionKey: false })
export class Daily {
  @ApiProperty({ description: '이메일', example: 'example@naver.com' })
  @Prop({ required: true })
  e_mail: string;

  @ApiProperty({ description: '날짜', example: 20220113 })
  @Prop({ required: true })
  date: number;

  @ApiProperty({ type: DailyDiet })
  @Prop({ type: [DailyDietSchema], required: true })
  daily_diet: DailyDiet[];

  @ApiProperty({ type: DailyExercise })
  @Prop({ type: [DailyExerciseSchema], required: true })
  daily_exercise: DailyExercise[];
}

export const DailySchema = SchemaFactory.createForClass(Daily);
DailySchema.index({ e_mail: 1, date: -1 }, { unique: true });
