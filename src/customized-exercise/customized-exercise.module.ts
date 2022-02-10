import { Module } from '@nestjs/common';
import { CustomizedExerciseService } from './customized-exercise.service';
import { CustomizedExerciseController } from './customized-exercise.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CustomizedExercise,
  CustomizedExerciseSchema,
} from 'src/schemas/customized-exercise.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CustomizedExercise.name, schema: CustomizedExerciseSchema },
    ]),
  ],
  providers: [CustomizedExerciseService],
  controllers: [CustomizedExerciseController],
  exports: [CustomizedExerciseService],
})
export class CustomizedExerciseModule {}
