import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type UserDocument = User & Document;

@Schema({ versionKey: false })
export class User {
  @Prop({ required: true, unique: true, default: uuidv4() })
  user_id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  birth: number;

  @Prop({ required: true, unique: true })
  e_mail: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: false })
  kakao_oauth: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
