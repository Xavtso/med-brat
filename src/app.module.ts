import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { ChatController } from './chat/chat.controller';
import { DiagnosisController } from './diagnosis/diagnosis.controller';

import { AppService } from './app.service';
import { ChatService } from './chat/chat.service';
import { DiagnosisService } from './diagnosis/diagnosis.service';

import { Chats, ChatsSchema } from './chat/model/chat.model';
import { Message, MessageSchema } from './chat/model/message.model';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_URL!),
    MongooseModule.forFeature([
      { name: Chats.name, schema: ChatsSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  controllers: [AppController, ChatController, DiagnosisController],
  providers: [AppService, ChatService, DiagnosisService],
})
export class AppModule {}
