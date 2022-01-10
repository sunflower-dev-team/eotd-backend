import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDetailDocument = UserDetail & Document;

@Schema({ collection: 'user_detail', versionKey: false })
export class UserDetail {
  @Prop({ required: true, unique: true })
  e_mail: string;

  @Prop({ required: true, unique: true })
  nickname: string;

  @Prop({ required: true, default: 0 })
  height: number;

  @Prop({ required: true, default: 0 })
  weight: number;

  @Prop({ required: true, default: 0 })
  smm: number;

  @Prop({ required: true, default: 0 })
  bfm: number;

  @Prop({ required: true, default: 0 })
  pbf: number;
}

export const UserDetailSchema = SchemaFactory.createForClass(UserDetail);
