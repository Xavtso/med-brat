import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { DiagnosisService } from 'src/diagnosis/diagnosis.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chats, ChatsSchema } from './model/chat.model';
import { Message } from './model/message.model';

@Module({
  controllers: [ChatController],
  providers: [ChatService, DiagnosisService],
  imports: [
    MongooseModule.forFeature([
      { name: Chats.name, schema: ChatsSchema },
      { name: Message.name, schema: Message },
    ]),
  ],
})
export class ChatModule {}
