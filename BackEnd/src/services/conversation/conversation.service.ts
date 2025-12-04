import { ObjectId } from "mongodb";
import { ConversationModel } from "../../models/conversations.schema";
import {
    Conversation,
    ConversationDTO,
    RecentConversationDTO,
} from "../../types/conversations.types";
import {
    transformDocument,
    transformDocuments,
} from "../../utils/transformDocument";
import { UserAvatarDTO } from "../../types/users.types";
import { userService } from "../user/users.service";

export const ConversationService = {
    async addUserToConversation(
        userId: ObjectId,
        conversationId: ObjectId,
        newUserId: ObjectId
    ): Promise<ConversationDTO> {
        const conversationExists = await ConversationModel.exists({
            _id: conversationId,
            participants: userId,
        });

        if (!conversationExists) {
            throw new Error("Ban khong co quyen thuc hien hanh dong nay");
        }

        const updatedConversation = await ConversationModel.findByIdAndUpdate(
            conversationId,
            { $addToSet: { participants: newUserId } },
            { new: true }
        );

        if (!updatedConversation) {
            throw new Error("Loi khi them nguoi dung vao");
        }

        return transformDocument(updatedConversation);
    },
    async addUsersToConversation(
        userId: ObjectId,
        conversationId: ObjectId,
        newUsersId: ObjectId[]
    ): Promise<ConversationDTO> {
        const conversationExists = await ConversationModel.exists({
            _id: conversationId,
            participants: userId,
        });

        if (!conversationExists) {
            throw new Error("Ban khong co quyen thuc hien hanh dong nay");
        }

        const updatedConversation = await ConversationModel.findByIdAndUpdate(
            conversationId,
            { $addToSet: { participants: newUsersId } },
            { new: true }
        );

        if (!updatedConversation) {
            throw new Error("Loi khi them nguoi dung vao");
        }

        return transformDocument(updatedConversation.toJSON());
    },
    async createConversation(
        userId: ObjectId,
        friendId: ObjectId
    ): Promise<ConversationDTO> {
        if (!userId || !friendId) {
            throw new Error("Id không hợp lệ");
        }

        const newConversation = await ConversationModel.create({
            participants: [userId, friendId],
        });
        console.log("createConversation", newConversation);
        return transformDocument(newConversation.toObject());
    },

    async getConversation(
        conversationId: ObjectId
    ): Promise<ConversationDTO | null> {
        if (!conversationId) {
            throw new Error("Id không hợp lệ");
        }

        try {
            const conversation = await ConversationModel.findById(
                conversationId
            ).lean();

            if (!conversation) {
                return null;
            }

            return transformDocument(conversation);
        } catch (error) {
            return null;
        }
    },

    async findByParticipants(
        userId: ObjectId,
        friendId: ObjectId
    ): Promise<ConversationDTO | null> {
        try {
            const conversation = await ConversationModel.findOne({
                participants: { $all: [userId, friendId], $size: 2 },
                isGroup: false,
            }).lean();
            if (!conversation) {
                return null;
            }
            return transformDocument(conversation);
        } catch (error) {
            return null;
        }
    },
    async getConversationById(
        conversationId: ObjectId
    ): Promise<ConversationDTO | null> {
        if (!conversationId) {
            throw new Error("Id khong hop le");
        }
        const conversation = await ConversationModel.findById(
            conversationId
        ).lean();

        if (!conversation) {
            console.log("Cuoc tro chuyen khong ton tai");
            return null;
        }
        return transformDocument(conversation);
    },

    async getConversationParticipants(
        conversationId: ObjectId
    ): Promise<UserAvatarDTO[] | null> {
        if (!conversationId) {
            throw new Error("Id khong hop le");
        }
        const conversation = await ConversationModel.findById(conversationId)
            .select("participants -_id")
            .populate({
                path: "participants",
                select: "name avatar email",
            })
            .lean();
        if (!conversation) {
            console.log("Cuoc tro chuyen khong ton tai");
            return null;
        }
        return transformDocuments(
            conversation.participants as unknown as UserAvatarDTO[]
        );
    },
    async getRecentConversations(
        userId: ObjectId
    ): Promise<RecentConversationDTO[] | null> {
        const conversations = await ConversationModel.find({
            participants: userId,
        })
            .sort({ lastMessageAt: -1 })
            .lean()
            .exec();

        const currentUserId = userId.toString();

        const result = await Promise.all(
            conversations.map(async (conversation) => {
                const transformed = transformDocument(conversation);
                if (transformed.isGroup) {
                    return transformed as RecentConversationDTO;
                }
                const result = await ConversationModel.findById(transformed.id)
                    .select("participants")
                    .lean();
                const Ids = result?.participants;

                const friendId = Ids?.find(
                    (id) => id.toString() !== currentUserId
                );
                const name = await userService.getUserNameById(friendId!);
                const ava = await userService.getUserAvaById(friendId!);

                return {
                    ...transformed,
                    avatar: ava,
                    name,
                } as RecentConversationDTO;
            })
        );
        return result;
    },
    async searchByName(query: string): Promise<ConversationDTO[] | []> {
        try {
            const result = await ConversationModel.find({
                name: { $regex: query, $options: "i" }, //i = ignore case , regex => name match với quêry
            }).lean();
            const transformed = transformDocuments(result);
            return transformed;
        } catch (error) {
            return [];
        }
    },
};
