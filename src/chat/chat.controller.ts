import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('new')
  async createChat() {
    console.log('Create new chat');
    return await this.chatService.createChat();
  }

  @Post('add/message')
  async addMessage(
    @Body('chatId') chatId: string,
    @Body('message') message: string,
    @Body('sender') sender: string,
  ) {
    return await this.chatService.addMessage(chatId, message, sender);
  }

  @Get('all')
  async getChats() {
    return await this.chatService.getChats();
  }

  @Get('/get/:chatId')
  async getChat(@Param('chatId') chatId: string) {
    return await this.chatService.getChat(chatId);
  }
}
