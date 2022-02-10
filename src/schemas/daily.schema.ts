import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { DailyDiet, DailyDietSchema } from './daily-diet.schema';
import { DailyRoutine, DailyRoutineSchema } from './daily-routine.schema';
import { ApiProperty } from '@nestjs/swagger';

// 데일리
@Schema({ versionKey: false, _id: false })
export class Daily {
  @ApiProperty({ description: '날짜', example: 20220113 })
  @Prop({ unique: true, required: true })
  date: number;

  @ApiProperty({ type: DailyDiet })
  @Prop({ type: [DailyDietSchema], required: true })
  daily_diet: DailyDiet[];

  @ApiProperty({ type: DailyRoutine })
  @Prop({ type: [DailyRoutineSchema], required: true })
  daily_routine: DailyRoutine[];
}
export const DailySchema = SchemaFactory.createForClass(Daily);

// 데일리 모음
export type DailysDocument = Dailys & Document;
@Schema({ collection: 'dailys', versionKey: false })
export class Dailys {
  @ApiProperty({
    description: 'uuid',
    example: '929aa1a4-8f76-4e28-9a0b-3888ded962b5',
  })
  @Prop({ type: Types.ObjectId })
  _id: string;

  @ApiProperty({ type: [Daily] })
  @Prop({ type: [DailySchema], required: true })
  dailys: Daily[];
}
export const DailysSchema = SchemaFactory.createForClass(Dailys);
