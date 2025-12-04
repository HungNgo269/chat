import { Avatar } from "./user";

export interface Conversation {
    id: string;
    participants?: string[];
    isGroup: boolean;
    name: string;
    avatar?: Avatar;
    lastMessage?: string;
    lastMessageAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
