import WebSocket, { WebSocketServer } from "ws";
import type { Server } from "http";
import { messageService } from "@/services/message/message.service";
import { MessageDTO } from "@/types/messages.types";
import { ConversationService } from "@/services/conversation/conversation.service";
import { configEnv } from "@/config/env";
interface Client {
    ws: WebSocket;
    userId: string;
    conversationId?: string;
}

export const InitializeWebsocket = ({ server }: { server: Server }) => {
    const wss = new WebSocketServer({
        server,
        path: "/ws",
        verifyClient: (info, callback) => {
            const origin = info.origin;

            if (!origin) {
                return callback(true);
            }

            if (configEnv.allowedOrigins.includes(origin)) {
                callback(true);
            } else {
                callback(false, 403, "Forbidden");
            }
        },
    });
    // TODO: chat nhiều người + hiển thị trạng thái user (online, offline) + typing ui ux, thông báo khi người dùng nhận kết bạn
    // Map: userId -> WebSocket để track online friend
    // TODO: sử dụng redis
    const onlineUsers = new Map<string, Set<WebSocket>>();
    function addOnline(userId: string, ws: WebSocket) {
        if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
        onlineUsers.get(userId)!.add(ws);
    }
    function removeOnline(userId: string, ws: WebSocket) {
        const set = onlineUsers.get(userId);
        if (!set) return;
        set.delete(ws);
        if (set.size === 0) onlineUsers.delete(userId);
    }
    // WebSocket -> Client info
    const clients = new Map<WebSocket, Client>();
    wss.on("connection", (ws: WebSocket) => {
        ws.on("message", async (message: WebSocket.RawData) => {
            try {
                const payload = JSON.parse(message.toString());
                if (payload.type === "JOIN") {
                    const clientInfo: Client = {
                        ws,
                        userId: payload.userId,
                        conversationId: payload.conversationId,
                    };
                    clients.set(ws, clientInfo);
                    addOnline(payload.userId, ws);
                    //=>gọi đổi trạng thái đang hoạt động + nút online
                }

                if (payload.type === "LEAVE") {
                    const c = clients.get(ws);
                    if (c) removeOnline(c.userId, ws);
                    return;
                }
                if (payload.type === "SEND_MESSAGE") {
                    const currentConversation =
                        await ConversationService.getConversationById(
                            payload.conversationId
                        );
                    if (!currentConversation) {
                        ws.send(
                            JSON.stringify({
                                type: "ERROR",
                                message: "Cuộc trò chuyện không tồn tại",
                            })
                        );
                        return;
                    }
                    const newMessage: MessageDTO = await messageService.create(
                        payload.senderId,
                        payload.conversationId,
                        payload?.receiverId,
                        payload?.text,
                        payload?.attachments
                    );

                    if (newMessage) {
                        for (const participantId of currentConversation.participants) {
                            const participantWebsockets = onlineUsers.get(
                                participantId.toString()
                            );
                            if (!participantWebsockets) {
                                continue;
                            }
                            for (const socket of participantWebsockets) {
                                if (socket.readyState === WebSocket.OPEN) {
                                    socket.send(
                                        JSON.stringify({
                                            type: "NEW_MESSAGE",
                                            data: newMessage,
                                        })
                                    );
                                }
                            }
                        }
                    }
                }
                if (payload.type === "TYPING_MESSAGE") {
                    const currentConversation =
                        await ConversationService.getConversationById(
                            payload.conversationId
                        );
                    if (!currentConversation) {
                        ws.send(
                            JSON.stringify({
                                type: "ERROR",
                                message: "Cuộc trò chuyện không tồn tại",
                            })
                        );
                        return;
                    }
                    for (const participantId of currentConversation.participants) {
                        const participantWebsockets = onlineUsers.get(
                            participantId.toString()
                        );
                        if (!participantWebsockets) {
                            continue;
                        }
                        for (const socket of participantWebsockets) {
                            if (socket.readyState === WebSocket.OPEN) {
                                socket.send(
                                    JSON.stringify({
                                        type: "USER_TYPING",
                                        conversationId: payload.conversationId,
                                        userId: payload.userId,
                                        isTyping: payload.isTyping,
                                    })
                                );
                            }
                        }
                    }
                }
            } catch (error) {
                ws.send(
                    JSON.stringify({
                        type: "ERROR",
                        message: "Không thể gửi tin nhắn",
                    })
                );
            }
        });
        ws.on("close", () => {
            const c = clients.get(ws);
            if (c) {
                removeOnline(c.userId, ws);
                clients.delete(ws);
            }
        });
    });
};
