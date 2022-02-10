import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

// Exercise-Set
@Schema({
  versionKey: false,
  _id: false,
})
export class ExerciseSet {
  @ApiProperty({
    description: '횟수',
    example: 10,
  })
  @Prop({ required: true })
  count: number;

  @ApiProperty({
    description: '중량',
    example: 70,
  })
  @Prop({ required: true })
  kg: number;
}
export const ExerciseSetSchema = SchemaFactory.createForClass(ExerciseSet);

// Daily-Exercise
@Schema({
  versionKey: false,
  _id: false,
})
export class DailyExercise {
  @ApiProperty({
    description: '운동 이름',
    example: '플렛 벤치 프레스',
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: '세트',
    example: [
      { count: 10, kg: 60 },
      { count: 9, kg: 55 },
    ],
  })
  @Prop({
    type: [ExerciseSetSchema],
    required: true,
  })
  set: ExerciseSet[];
}
export const DailyExerciseSchema = SchemaFactory.createForClass(DailyExercise);

// Daily-Routine
export type DailyRoutineDocument = DailyRoutine & Document;

@Schema({ versionKey: false, _id: false })
export class DailyRoutine {
  @ApiProperty({
    description: '운동 루틴 ID',
    example: '06320d52-735a-40d1-a6cb-19e99932181c',
  })
  @Prop({ required: true })
  routine_id: string;

  @ApiProperty({
    description: '데일리 운동 타이틀',
    example: '잊혀지지 않을 스미스 머신',
  })
  @Prop({ required: true })
  title: string;

  @ApiProperty({
    description: '운동한 시간',
    example: '01:20',
    required: false,
  })
  @Prop()
  time: string;

  @ApiProperty({
    description: '운동 인증 사진',
    example:
      'https://media.vlpt.us/images/peter0618/post/51a9e282-ae0a-46ef-85bd-8ab0a36747fc/Nestjs.png',
    required: false,
  })
  @Prop()
  imgs: string[];

  @ApiProperty({
    type: [DailyExercise],
  })
  @Prop({ type: [DailyExerciseSchema], required: true })
  exercises: DailyExercise[];
}
export const DailyRoutineSchema = SchemaFactory.createForClass(DailyRoutine);
