import { Test, TestingModule } from '@nestjs/testing';
import { CustomizedExerciseService } from './customized-exercise.service';

describe('CustomizedExerciseService', () => {
  let service: CustomizedExerciseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomizedExerciseService],
    }).compile();

    service = module.get<CustomizedExerciseService>(CustomizedExerciseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
