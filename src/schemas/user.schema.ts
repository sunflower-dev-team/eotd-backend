import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ collection: 'user', versionKey: false })
export class User {
  @Prop({ unique: true, required: true })
  e_mail: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  birth: number;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: false })
  isVerifyMailToken: boolean;

  @Prop({ required: true, default: false })
  kakao_oauth: boolean;

  @Prop({ required: true, default: false })
  admin: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
