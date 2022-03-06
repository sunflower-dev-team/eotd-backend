import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ExerciseDocument = Exercise & Document;

@Schema({ collection: 'exercise', versionKey: false })
export class Exercise {
  @ApiProperty({
    description: '운동 이름',
    example: '벤치프레스',
  })
  @Prop({ index: true, required: true })
  exercise_name: string;

  @ApiProperty({
    description: '운동 부위',
    example: '가슴',
  })
  @Prop({ index: true, required: true })
  target: string;

  @ApiProperty({
    description: '설명',
    example: '벤치프레스는 가슴을 모아 가슴 근육 발달에...',
  })
  @Prop({ required: true })
  description: string;

  @ApiProperty({
    description: '링크',
    example: [
      'https://stackoverflow.com/questions/62050741/request-body-not-showing-in-nest-js-swagger',
      'https://stackoverflow.com/questions/62050741/request-body-not-showing-in-nest-js-swagger',
    ],
  })
  @Prop()
  links: string[];

  @ApiProperty({
    description: '응급처치',
    example: [
      'https://stackoverflow.com/questions/62050741/request-body-not-showing-in-nest-js-swagger',
      'https://stackoverflow.com/questions/62050741/request-body-not-showing-in-nest-js-swagger',
    ],
  })
  @Prop()
  first_aid: string[];
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
