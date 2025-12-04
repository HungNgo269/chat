import { ObjectId } from "mongodb";
import { Attachment } from "./attachment.types";
import { UserAvatarDTO } from "./users.types";

export interface Message {
    _id: ObjectId;
    text?: string | null;
    conversationId: ObjectId;
    senderId: string;
    receiverId?: ObjectId | null;
    createdAt?: Date;
    updatedAt?: Date;
    attachments?: Attachment | null;
}
export type MessageDTO = Omit<Message, "_id" | "__v"> & { id: string };
