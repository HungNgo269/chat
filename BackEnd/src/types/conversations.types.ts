import { ObjectId } from "mongodb";
import { Avatar } from "./users.types";

export interface Conversation {
    _id: ObjectId;
    name: string | null;
    avatar?: Avatar;
    participants: ObjectId[];
    isGroup: boolean;
    lastMessage?: string | null;
    lastMessageAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export type ConversationDTO = Omit<Conversation, "_id" | "__v"> & {
    id: string;
};
export type RecentConversationDTO = Omit<
    Conversation,
    "_id" | "__v" | "participants"
> & {
    id: string;
};
