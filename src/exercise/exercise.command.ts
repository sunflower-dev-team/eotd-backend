import { Command, Positional } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { data } from '../seeds/exercise.seed';
import { ExerciseService } from './exercise.service';

@Injectable()
export class ExerciseCommand {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Command({
    command: 'seed:exercise',
    describe: 'generate create a Exercise-seed',
  })
  async seed(): Promise<void> {
    await this.exerciseService.createExercise(data).catch((err) => {
      console.log(err);
      return;
    });
    return;
  }
}
