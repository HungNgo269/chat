import { Request, Response } from "express";
import { ConversationService } from "@/services/conversation/conversation.service";
import { ObjectId } from "mongodb";
import { messageService } from "@/services/message/message.service";
import { getValidObjectId } from "@/utils/checkValidObjectId";
export const getConversation = async (req: Request, res: Response) => {
    try {
        const { conversationId } = req.body;
        const conversation = await ConversationService.getConversation(
            conversationId
        );

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Cuộc trò chuyện không tồn tại",
            });
        }

        const messages = await messageService.getAll(conversation.id, 1);

        return res.json({
            success: true,
            data: {
                conversation,
                messages,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi khi lấy cuộc trò chuyện",
        });
    }
};
export const createConversation = async (req: Request, res: Response) => {
    try {
        const userID = req.user?.userId;
        const userId = getValidObjectId(userID!);
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID không hợp lệ",
            });
        }
        const { friendId } = req.body;
        const conversation = await ConversationService.createConversation(
            userId!,
            friendId
        );

        return res.json({
            success: true,
            data: {
                conversation,
                messages: [],
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi khi tạo cuộc trò chuyện",
        });
    }
};
export const getOrCreateConversation = async (req: Request, res: Response) => {
    try {
        const userID = req.user?.userId;
        const userId = getValidObjectId(userID!);

        const { friendId } = req.body;
        const friendIdObject = getValidObjectId(friendId!);

        if (!userId || !friendIdObject) {
            return res.status(400).json({
                success: false,
                message: " ID không hợp lệ",
            });
        }

        let conversation = await ConversationService.findByParticipants(
            userId,
            friendIdObject
        );
        if (!conversation) {
            conversation = await ConversationService.createConversation(
                userId,
                friendIdObject
            );
        }

        const messages = await messageService.getAll(conversation.id, 1);
        return res.json({
            success: true,
            data: {
                conversation,
                messages,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi khi xử lý cuộc trò chuyện",
        });
    }
};
export const addUserToConversation = async (req: Request, res: Response) => {
    try {
        const { conversationId } = req.params;
        const userID = req.user?.userId;
        const userId = getValidObjectId(userID!);
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID không hợp lệ",
            });
        }
        const { friendId } = req.body;
        const conversation = await ConversationService.addUserToConversation(
            userId,
            conversationId as unknown as ObjectId,
            friendId
        );
        return res.json({ success: true, data: conversation });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi khi thêm người dùng vào cuộc trò chuyện",
        });
    }
};
export const addUsersToConversation = async (req: Request, res: Response) => {
    try {
        const { conversationId } = req.params;
        const userID = req.user?.userId;
        const userId = getValidObjectId(userID!);
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID không hợp lệ",
            });
        }

        const { friendId } = req.body;
        const conversation = await ConversationService.addUserToConversation(
            userId!,
            conversationId as unknown as ObjectId,
            friendId
        );
        return res.json({ success: true, data: conversation });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi khi thêm người dùng vào cuộc trò chuyện",
        });
    }
};
export const getRecentConversation = async (req: Request, res: Response) => {
    try {
        const userID = req.user?.userId;
        const userId = getValidObjectId(userID!);
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID không hợp lệ",
            });
        }

        const data = await ConversationService.getRecentConversations(userId);
        return res.json({ success: true, data });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi khi tìm kiếm các cuộc trò chuyện gần đây",
        });
    }
};
export const searchConversation = async (req: Request, res: Response) => {
    const { query } = req.query;
    try {
        const result = await ConversationService.searchByName(query as string);
        return res.json({ success: true, data: result });
    } catch {
        return res
            .status(400)
            .json({ success: false, message: "Tìm kiếm lỗi" });
    }
};
export const getConversationParticipants = async (
    req: Request,
    res: Response
) => {
    const { conversationId } = req.body;
    try {
        const data = await ConversationService.getConversationParticipants(
            conversationId
        );
        return res.json({ success: true, data });
    } catch {
        return res
            .status(400)
            .json({ success: false, message: "Tìm kiếm lỗi" });
    }
};
