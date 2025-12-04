import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { useWebSocketContext } from "@/context/WebSocketContext";
import { MessageStatus } from "@/interfaces/enums";
import { Message } from "@/interfaces/message";

export const useMessageWebSocket = (conversationId: string | undefined) => {
    const queryClient = useQueryClient();
    const { subscribe } = useWebSocketContext();

    useEffect(() => {
        if (!conversationId) return;

        const unsubscribe = subscribe((response: any) => {
            const isNewMessage =
                response.type === "NEW_MESSAGE" ||
                response.type === MessageStatus.new;

            if (isNewMessage && response.data) {
                const incomingMsg = response.data;

                if (incomingMsg.conversationId !== conversationId) return;

                const newMessage: Message = {
                    id: incomingMsg.id,
                    senderId: incomingMsg.senderId,
                    conversationId: incomingMsg.conversationId,
                    text: incomingMsg.text,
                    attachments: incomingMsg.attachments,
                    createdAt: incomingMsg.createdAt,
                    updatedAt: incomingMsg.updatedAt,
                };

                queryClient.setQueryData(
                    ["messages", conversationId],
                    (oldData: any) => {
                        if (!oldData) return oldData;

                        return {
                            ...oldData,
                            pages: oldData.pages.map(
                                (page: any, index: number) => {
                                    if (index === 0) {
                                        return [newMessage, ...page];
                                    }

                                    return page;
                                },
                            ),
                        };
                    },
                );
            }
        });

        return unsubscribe;
    }, [conversationId, queryClient, subscribe]);
};
