import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DailyDietDocument = DailyDiet & Document;

@Schema({ collection: 'daily_diet', versionKey: false, _id: false })
export class DailyDiet {
  @Prop({ required: true })
  diet_id: string;

  @Prop({ required: true })
  diet_type: string;

  @Prop()
  details: string;

  @Prop()
  time: string;

  @Prop()
  meal_img: string;

  @Prop({ required: true })
  rate: number;
}

export const DailyDietSchema = SchemaFactory.createForClass(DailyDiet);
