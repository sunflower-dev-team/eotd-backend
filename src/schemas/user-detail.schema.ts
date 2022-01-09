// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// export type UserDetailDocument = UserDetail & Document;

// @Schema()
// export class UserDetail {
//   @Prop({ required: true, unique: true })
//   e_mail: string;

//   @Prop({ required: true, unique: true })
//   nickname: string;

//   @Prop({ default: 0 })
//   height: number;

//   @Prop({ default: 0 })
//   weight: number;

//   @Prop({ default: 0 })
//   smm: number; // 골격근량

//   @Prop({ default: 0 })
//   bfm: number; // 체지방량

//   @Prop({ default: 0 })
//   pbf: number; // 체지방률

//   @Prop({ required: true, default: { count: 0, hour: 0 } })
//   dailyExerciseHabit: object; // 하루 운동 횟수,시간

//   @Prop({ required: true, default: { count: 0, hour: 0 } })
//   weeklyExerciseHabit: object; // 일주일 운동 횟수,시간
// }

// export const UserDetailSchema = SchemaFactory.createForClass(UserDetail);
