import { Request, Response } from "express";
import { messageService } from "../../services/message/message.service";
import { getValidObjectId } from "../../utils/checkValidObjectId";

export const sendMessage = async (req: Request, res: Response) => {
    const { conversationId, receiverId, text, attachments } = req.body;
    const sender = req.user?.userId;
    if (!sender) {
        return res.status(401).json({
            success: false,
            message: "Không thể gửi tin nhắn",
        });
    }
    const senderId = getValidObjectId(sender);
    try {
        const message = await messageService.create(
            senderId!,
            conversationId,
            receiverId,
            text,
            attachments
        );
        return res.json({ success: true, data: message });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi khi gửi tin nhắn",
        });
    }
};
export const getMessages = async (req: Request, res: Response) => {
    const { conversationId, page } = req.body;
    if (!conversationId) {
        return res.status(400).json({
            success: false,
            message: "Hãy bắt đầu cuộc trò chuyện",
        });
    }
    try {
        const messages = await messageService.getAll(conversationId, page);
        return res.json({ success: true, data: messages });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi khi gửi tin nhắn",
        });
    }
};
