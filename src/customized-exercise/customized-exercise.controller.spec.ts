import { Test, TestingModule } from '@nestjs/testing';
import { CustomizedExerciseController } from './customized-exercise.controller';

describe('CustomizedExerciseController', () => {
  let controller: CustomizedExerciseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomizedExerciseController],
    }).compile();

    controller = module.get<CustomizedExerciseController>(CustomizedExerciseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
