import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CertificateDocument = Certificate & Document;

@Schema({ collection: 'certificate', versionKey: false })
export class Certificate {
  @Prop({ unique: true, required: true })
  e_mail: string;

  @Prop({ required: true })
  authMailToken: string;

  @Prop()
  refreshToken: string;

  @Prop()
  refreshSecret: string;
}

export const CertificateSchema = SchemaFactory.createForClass(Certificate);
