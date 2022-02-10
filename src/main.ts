import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: true,
      methods: ['GET', 'POST', 'OPTIONS', 'PATCH', 'DELETE'],
      credentials: true,
    },
  });
  const swagger = new DocumentBuilder()
    .setTitle('EOTD')
    .setDescription('Exercise Of The Day API')
    .setVersion('1.0')
    .addCookieAuth('accesstoken', {
      in: 'header',
      type: 'apiKey',
      scheme: 'apiKey',
    })
    .build();
  const config = app.get(ConfigService);
  const port = config.get('PORT');
  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.use(cookieParser());
  await app.listen(port);
}
bootstrap();
