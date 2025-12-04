import { useEffect } from "react";

import { useWebSocketContext } from "@/context/WebSocketContext";

export const useConversationConnection = (
    conversationId: string | undefined,
) => {
    const { joinConversation, leaveConversation } = useWebSocketContext();

    useEffect(() => {
        if (conversationId) {
            joinConversation(conversationId);

            return () => {
                leaveConversation(conversationId);
            };
        }
    }, [conversationId, joinConversation, leaveConversation]);
};
