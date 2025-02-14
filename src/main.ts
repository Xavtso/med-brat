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
  app.enableCors({
    origin: '*', // Дозволяємо всі походження
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false, // Вимикаємо, оскільки автентифікації немає
  });
  await app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
start();
