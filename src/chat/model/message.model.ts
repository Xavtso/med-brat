import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ timestamps: true, collection: 'message' })
export class Message extends Document {
  @Prop({ required: true })
  message: string;

  @Prop({ required: true, type: String, enum: ['user', 'bot'] })
  sender: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
