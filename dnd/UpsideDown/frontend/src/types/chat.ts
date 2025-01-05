export type MessageType = 'text' | 'image' | 'private';

export interface Message {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: number;
  type: MessageType;
  recipientId?: string;
  recipientName?: string;
  imageUrl?: string;
}