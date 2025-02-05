import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cors from 'cors';
import { ValidationPipe } from '@nestjs/common';

async function start() {
  dotenv.config();
  const PORT = process.env.PORT || 5001;

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(
    cors({
      origin: '*',
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Methods',
        'Access-Control-Allow-Credentials',
        'X-Requested-With',
        'x-access-token',
        'x-refresh-token',
        'x-client-id',
        'multipart/form-data',
      ],
    }),
  );
  await app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
start();
