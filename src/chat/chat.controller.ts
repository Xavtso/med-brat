import { Controller, Post, Body, Get } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('new')
  createChat() {
    return this.chatService.createChat();
  }

  @Post('message')
  addMessage(
    @Body('chatId') chatId: string,
    @Body('message') message: string,
    @Body('sender') sender: string,
  ) {
    return this.chatService.addMessage(chatId, message, sender);
  }

  @Get('chat')
  getChat(@Body('chatId') chatId: string) {
    return this.chatService.getChat(chatId);
  }
}
