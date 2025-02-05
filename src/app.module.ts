import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatService } from './chat/chat.service';
import { ChatController } from './chat/chat.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { DiagnosisModule } from './diagnosis/diagnosis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_URL!),
    DiagnosisModule,
  ],
  controllers: [AppController, ChatController],
  providers: [AppService, ChatService],
})
export class AppModule {}
