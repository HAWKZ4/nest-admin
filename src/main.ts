import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const allowedOrigin = configService.get<string>('CORS_ORIGIN');

  if (!allowedOrigin) {
    throw new HttpException(
      'CORS_ORIGIN environment variable is not set',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  const backendPort = configService.get<number>('BACKEND_PORT') ?? 3000;

  app.use(cookieParser());

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: allowedOrigin,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(backendPort);
}
bootstrap();
