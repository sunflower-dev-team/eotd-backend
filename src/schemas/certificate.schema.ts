import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CertificateDocument = Certificate & Document;

@Schema({ versionKey: false })
export class Certificate {
  @Prop({ required: true, unique: true })
  e_mail: string;

  @Prop({ required: true })
  authMailToken: string;

  @Prop()
  refreshToken: string;

  @Prop()
  refreshSecret: string;
}

export const CertificateSchema = SchemaFactory.createForClass(Certificate);
