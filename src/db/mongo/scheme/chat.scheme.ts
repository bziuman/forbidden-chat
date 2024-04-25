import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
  @Prop({ enum: ['private', 'multiuser'], required: true })
  type: string;

  @Prop({ type: Number, required: true })
  createBy: number;

  @Prop({ type: Number })
  participantsId: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
