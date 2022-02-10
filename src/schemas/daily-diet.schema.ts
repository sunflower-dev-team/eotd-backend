import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type DailyDietDocument = DailyDiet & Document;

@Schema({ versionKey: false, _id: false })
export class DailyDiet {
  @ApiProperty({
    description: '데일리 식단 ID',
    example: '06320d52-735a-40d1-a6cb-19e99932181c',
  })
  @Prop({ required: true })
  diet_id: string;

  @ApiProperty({ description: '식단 유형', example: '아침' })
  @Prop({ required: true })
  diet_type: string;

  @ApiProperty({
    description: '세부사항',
    example: '부대찌개에 밥 4공기 뚝딱... 식단 잘 짜자 길동아',
    required: false,
  })
  @Prop()
  detail: string;

  @ApiProperty({ description: '식사 시간', example: '08:20', required: false })
  @Prop()
  time: string;

  @ApiProperty({
    description: '음식 사진',
    example:
      'https://media.vlpt.us/images/peter0618/post/51a9e282-ae0a-46ef-85bd-8ab0a36747fc/Nestjs.png',
    required: false,
  })
  @Prop()
  imgs: string[];

  @ApiProperty({ description: '식단 평점', example: 3 })
  @Prop({ required: true })
  rate: number;
}
export const DailyDietSchema = SchemaFactory.createForClass(DailyDiet);
