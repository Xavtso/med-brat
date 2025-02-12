import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Message, MessageSchema } from './message.model';

@Schema({ collection: 'chats' })
export class Chats extends Document {
  @Prop({
    type: [Message],
    required: true,
    schema: MessageSchema,
    default: [
      {
        message: "Hello! I am your personal MedBbrat. What's bothering you?",
        sender: 'bot',
      },
    ],
  })
  messages: Message[];
  @Prop({ type: Date, required: true, default: Date.now() })
  lastMessageAt: Date;
  toJSON() {
    return {
      lastMessageAt: this.lastMessageAt
        ? this.lastMessageAt.toLocaleString('uk-UA')
        : null,
    };
  }
}

export const ChatsSchema = SchemaFactory.createForClass(Chats);
