import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type DailyExerciseDocument = DailyExercise & Document;

@Schema({ collection: 'daily_exercise', versionKey: false, _id: false })
export class DailyExercise {
  @ApiProperty({
    description: '데일리 운동 ID',
    example: '06320d52-735a-40d1-a6cb-19e99932181c',
  })
  @Prop({ required: true })
  exercise_id: string;

  @ApiProperty({
    description: '운동 이름',
    example: '벤치프레스',
  })
  @Prop({ required: true })
  exercise_name: string;

  @ApiProperty({
    description: '운동 인증 사진',
    example:
      'https://media.vlpt.us/images/peter0618/post/51a9e282-ae0a-46ef-85bd-8ab0a36747fc/Nestjs.png',
    required: false,
  })
  @Prop()
  exercise_img: string;

  @ApiProperty({
    description: '운동 시작 시간',
    example: '08:00',
    required: false,
  })
  @Prop()
  startAt: string;

  @ApiProperty({
    description: '운동 종료 시간',
    example: '08:15',
    required: false,
  })
  @Prop()
  endAt: string;
}

export const DailyExerciseSchema = SchemaFactory.createForClass(DailyExercise);
