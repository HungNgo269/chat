import { ObjectId } from "mongodb";
import { ConversationModel } from "@/models/conversations.schema";
import { MessageModel } from "@/models/messages.schema";
import { Attachment } from "@/types/attachment.types";
import { MessageDTO } from "@/types/messages.types";
import {
    transformDocument,
    transformDocuments,
} from "@/utils/transformDocument";

export const messageService = {
    async create(
        senderId: ObjectId,
        conversationId: ObjectId,
        receiverId?: ObjectId,
        text?: string,
        attachments?: Attachment | null
    ): Promise<MessageDTO> {
        if (!senderId || !conversationId) {
            throw new Error("Không thể gửi tin nhắn");
        }

        const timestamp = new Date();

        const newMessage = await MessageModel.create({
            conversationId: conversationId,
            senderId: senderId,
            receiverId: receiverId,
            text: text,
            attachments: attachments,
        });
        await ConversationModel.findByIdAndUpdate(
            conversationId,
            {
                lastMessage: text,
                lastMessageAt: timestamp,
            },
            { new: false }
        );
        if (!newMessage) {
            throw new Error("Không thể gửi tin nhắn");
        }
        return transformDocument(newMessage.toObject());
    },
    async getAll(conversationId: string, page: number): Promise<MessageDTO[]> {
        const limit = 20;
        const offset = (page - 1) * limit;
        if (!conversationId) {
            throw new Error("Cuộc trò chuyện không tồn tại");
        }
        const listMessages = await MessageModel.find({
            conversationId: conversationId,
        })
            .skip(offset)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();
        if (!listMessages?.length) {
            return [];
        }
        return transformDocuments(listMessages);
    },
};
