import { BadRequestException, Injectable } from '@nestjs/common';
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
   * Створює новий чат, додаючи до нього перше повідомлення від бота.
   * @returns {Promise<Chats>} - Об'єкт створеного чату.
   */
  async createChat() {
    console.log('Create new chat');

    // Створюємо новий чат із першим повідомленням від бота
    const createdChat = await this.chatModel.create({
      messages: [
        {
          message: `Hello, I'm your personal MedBrat. What's bothering you? `,
          sender: 'bot',
        },
      ],
    });

    return createdChat;
  }

  /**
   * Додає повідомлення до конкретного чату.
   * Якщо повідомлення від користувача, то отримуємо відповідь від сервісу діагностики.
   * @param {string} chatId - Ідентифікатор чату.
   * @param {string} message - Текст повідомлення.
   * @param {string} sender - Відправник повідомлення (user або bot).
   * @returns {Promise<any>} - Створене повідомлення або пара повідомлень (користувача і бота).
   */
  async addMessage(chatId: string, message: string, sender: string) {
    if (sender === 'user') {
      // Створюємо повідомлення від користувача
      const createdUserMessage = await this.messageModel.create({
        message,
        sender,
      });

      // Додаємо повідомлення користувача в масив `messages` вказаного чату
      await this.chatModel
        .updateOne({ _id: chatId }, { $push: { messages: createdUserMessage } })
        .exec();

      // Аналізуємо повідомлення користувача, отримуючи відповідь від DiagnosisService
      const diagnosisResult =
        await this.diagnosisService.analyzeSymptoms(message);

      // Формуємо відповідь бота, якщо вона доступна
      const systemText =
        diagnosisResult.message || JSON.stringify(diagnosisResult);

      // Створюємо відповідне повідомлення від бота
      const createdBotMessage = await this.messageModel.create({
        message: systemText,
        sender: 'bot',
      });

      // Додаємо повідомлення бота до чату
      await this.chatModel
        .updateOne({ _id: chatId }, { $push: { messages: createdBotMessage } })
        .exec();

      // Повертаємо об'єкт, що містить як повідомлення користувача, так і відповідь бота
      return { userMessage: createdUserMessage, botMessage: createdBotMessage };
    } else {
      // Якщо відправник — не користувач, просто додаємо повідомлення до чату
      const createdMessage = await this.messageModel.create({
        message,
        sender,
      });

      await this.chatModel
        .updateOne({ _id: chatId }, { $push: { messages: createdMessage } })
        .exec();

      return createdMessage;
    }
  }

  /**
   * Отримує повний об'єкт чату з повідомленнями за його ідентифікатором.
   * @param {string} chatId - Ідентифікатор чату.
   * @returns {Promise<Chats>} - Об'єкт чату, якщо знайдено.
   * @throws {BadRequestException} - Якщо chatId не передано.
   */
  async getChat(chatId: string) {
    try {
      if (!chatId) {
        throw new BadRequestException('Chat ID is required');
      }

      // Шукаємо чат за його ID
      const chat = await this.chatModel.findOne({ _id: chatId });

      return chat;
    } catch (error) {
      console.error('Помилка отримання чату:', error);
      throw error;
    }
  }

  /**
   * Отримує список усіх чатів у базі даних.
   * Якщо жодного чату не знайдено, створює новий чат і повертає його.
   * @returns {Promise<Chats[]>} - Масив об'єктів чатів.
   */
  async getChats() {
    try {
      console.log('Get all chats');

      // Отримуємо всі чати з бази даних
      const chats = await this.chatModel.find().exec();

      console.log('Chats:', chats);

      if (!chats || chats.length === 0) {
        console.log('Chats not found in DB');
        return [await this.createChat()];
      }

      return chats;
    } catch (error) {
      console.error('Помилка отримання чатів:', error);
      throw error;
    }
  }

  /**
   * Викликає діагностику симптомів через DiagnosisService,
   * створює повідомлення від бота і додає його до чату.
   * @param {string} symptoms - Симптоми, що надіслав користувач.
   * @param {string} chatId - Ідентифікатор чату.
   * @returns {Promise<any>} - Діагностичний результат та створене повідомлення.
   */
  async getDiagnosis(symptoms: string, chatId: string) {
    // Викликаємо сервіс діагностики, щоб отримати результат аналізу симптомів
    const diagnosisResult =
      await this.diagnosisService.analyzeSymptoms(symptoms);

    // Формуємо текст відповіді, що буде відправлений користувачеві
    const systemText =
      diagnosisResult.message || JSON.stringify(diagnosisResult);

    // Створюємо нове повідомлення від бота з діагностичним результатом
    await this.messageModel.create({
      message: systemText,
      sender: 'bot',
    });

    // Додаємо це повідомлення в конкретний чат
    return await this.addMessage(chatId, systemText, 'bot');
  }
}
