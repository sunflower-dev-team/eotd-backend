import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema({ collection: 'user', versionKey: false })
export class User {
  @ApiProperty({
    description: '이메일',
    example: 'example.naver.com',
  })
  @Prop({ unique: true, required: true })
  e_mail: string;

  @ApiProperty({ description: '이름', example: '홍길동' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: '성별', example: 'male' })
  @Prop({ required: true })
  gender: string;

  @ApiProperty({ description: '생일', example: 19950430 })
  @Prop({ required: true })
  birth: number;

  @ApiProperty({ description: '비밀번호', example: 'q1w2e3@@' })
  @Prop({ required: true })
  password: string;

  @ApiProperty({
    description: '메일 인증',
    example: true,
  })
  @Prop({ required: true, default: false })
  isVerifyMailToken: boolean;

  @ApiProperty({
    description: 'oauth 유저',
    example: false,
  })
  @Prop({ required: true, default: false })
  kakao_oauth: boolean;

  @ApiProperty({ description: '관리자 권한', example: false })
  @Prop({ required: true, default: false })
  admin: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
