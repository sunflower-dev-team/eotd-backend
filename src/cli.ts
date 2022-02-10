import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from 'nestjs-command';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });

  try {
    console.log('Start command');
    await app.select(CommandModule).get(CommandService).exec();
    console.log('End command');
    await app.close();
  } catch (err) {
    console.log(err);
    await app.close();
    return process.exit(1);
  }
}

bootstrap();
