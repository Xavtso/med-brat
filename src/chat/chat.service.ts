// chat.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chats } from './model/chat.model';
import { Model } from 'mongoose';
import { Message } from './model/message.model';
import { DiagnosisService } from 'src/diagnosis/diagnosis.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chats.name) private readonly chatModel: Model<Chats>,
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    private readonly diagnosisService: DiagnosisService,
  ) {}

  /**
   * Створює новий чат (порожній)
   */
  async createChat() {
    const createdChat = await this.chatModel.create();
    return createdChat;
  }

  /**
   * Додає повідомлення (message) від певного відправника (sender) у конкретний чат (chatId).
   */
  async addMessage(chatId: string, message: string, sender: string) {
    const createdMessage = await this.messageModel.create({
      message: message,
      sender: sender,
    });

    await this.chatModel
      .updateOne({ _id: chatId }, { $push: { messages: createdMessage } })
      .exec();

    return createdMessage;
  }

  /**
   * Повертає увесь чат із повідомленнями за chatId
   */
  async getChat(chatId: string) {
    const chat = await this.chatModel
      .findById(chatId)
      .populate('messages')
      .exec();
    return chat;
  }

  /**
   * Повертає список усіх чатів (без повідомлень)
   */
  async getChats() {
    const chats = await this.chatModel.find().exec();
    return chats;
  }

  /**
   * Викликає діагностику симптомів, зберігає системне повідомлення з результатом,
   * і повертає рекомендації від DiagnosisService.
   */
  async getDiagnosis(symptoms: string, chatId: string) {
    // 1. Викликаємо DiagnosisService, щоб отримати діагноз і рекомендації
    const diagnosisResult =
      await this.diagnosisService.analyzeSymptoms(symptoms);

    // diagnosisResult зазвичай міститиме поля на кшталт:
    // {
    //    "language_detected": "uk",
    //    "diagnosis_en": "common cold",
    //    "advice_uk": "...",
    //    "message": "..."
    // }
    // або іншу структуру, залежно від реалізації.

    // 2. Формуємо текст системного повідомлення
    //    Наприклад, беремо поле `message` (як короткий підсумок)
    const systemText =
      diagnosisResult.message || JSON.stringify(diagnosisResult);

    // 3. Створюємо в БД повідомлення від "bot"
    await this.messageModel.create({
      message: systemText,
      sender: 'bot',
    });

    // 4. Додаємо це повідомлення до потрібного чату
    await this.addMessage(chatId, systemText, 'bot');

    // 5. Повертаємо користувачеві повний об’єкт із діагнозом
    return diagnosisResult;
  }
}
