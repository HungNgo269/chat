import { Attachment } from "./attachment";
import { MessageStatus } from "./enums";
import { Avatar } from "./user";

export interface Message {
    id: string;
    text?: string;
    senderId: string;

    conversationId: string;
    receiverId?: string;
    attachments?: Attachment | null;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface MessageSend {
    text?: string;
    type: MessageStatus;
    attachments?: Attachment | null;
    senderId: string;
    receiverId?: string;
    conversationId: string;
}
