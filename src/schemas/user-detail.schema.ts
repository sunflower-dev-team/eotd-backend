import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDetailDocument = UserDetail & Document;

@Schema({ collection: 'user_detail', versionKey: false })
export class UserDetail {
  @ApiProperty({
    description: '이메일',
    example: 'example.naver.com',
  })
  @Prop({ unique: true, required: true })
  e_mail: string;

  @ApiProperty({
    description: '닉네임',
    example: '나는헬창',
  })
  @Prop({ unique: true, required: true })
  nickname: string;

  @ApiProperty({
    description: '키',
    example: '180',
  })
  @Prop({ required: true, default: 0 })
  height: number;

  @ApiProperty({
    example: 75,
    description: '몸무게',
  })
  @Prop({ required: true, default: 0 })
  weight: number;

  @ApiProperty({
    example: 40,
    description: '골격근량(SMM: Skeletal Muscle Mass)',
  })
  @Prop({ required: true, default: 0 })
  smm: number;

  @ApiProperty({
    example: 14,
    description: '체지방량(BFM: Body Fat Mass)',
  })
  @Prop({ required: true, default: 0 })
  bfm: number;

  @ApiProperty({
    example: 23,
    description: 'BMI(Body Mass Index)',
  })
  @Prop({ required: true, default: 0 })
  bmi: number;

  @ApiProperty({
    example: 12,
    description: '체지방률(PBF: Percent Body Fat)',
  })
  @Prop({ required: true, default: 0 })
  pbf: number;
}

export const UserDetailSchema = SchemaFactory.createForClass(UserDetail);
