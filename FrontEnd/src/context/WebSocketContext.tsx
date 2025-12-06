import {
    createContext,
    useContext,
    useEffect,
    useState,
    useRef,
    ReactNode,
    useCallback,
    useMemo,
} from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/store/auth.store";
import { Message, MessageSend } from "@/interfaces/message";
import { Conversation } from "@/interfaces/conversation";

interface WebSocketContextType {
    subscribe: (callback: (response: any) => void) => () => void;
    sendMessage: (data: MessageSend) => boolean;
    isConnected: boolean;
    joinConversation: (conversationId: string) => void;
    leaveConversation: (conversationId: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const useWebSocketContext = () => {
    const context = useContext(WebSocketContext);

    if (!context) {
        throw new Error(
            "useWebSocketContext must be used within WebSocketProvider",
        );
    }

    return context;
};

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
    const wsRef = useRef<WebSocket | null>(null);
    const listenersRef = useRef<Set<(data: any) => void>>(new Set());
    const [isConnected, setIsConnected] = useState(false);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
    const currentConversationRef = useRef<string | null>(null);

    const user = useAuthStore((state) => state.user);
    const userId = user?.id;

    const queryClient = useQueryClient();

    const handleNewMessage = useCallback(
        (newMessage: Message) => {
            queryClient.setQueryData(
                ["conversation"],
                (oldData: Conversation[]) => {
                    if (!oldData) return oldData;
                    const updatedConversations = oldData.map(
                        (conversation: Conversation) => {
                            if (conversation.id === newMessage.conversationId) {
                                return {
                                    ...conversation,
                                    lastMessage: newMessage.text,
                                    lastMessageAt: newMessage.createdAt,
                                };
                            }
                            return conversation;
                        },
                    );

                    return updatedConversations;
                },
            );
        },
        [queryClient],
    );

    useEffect(() => {
        const connectWebSocket = () => {
            if (wsRef.current?.readyState === WebSocket.OPEN || !userId) return;

            const ws = new WebSocket(`${import.meta.env.VITE_SOCKET_URL}`);

            wsRef.current = ws;

            ws.onopen = () => {
                setIsConnected(true);
                if (currentConversationRef.current) {
                    ws.send(
                        JSON.stringify({
                            type: "JOIN",
                            userId: userId,
                            conversationId: currentConversationRef.current,
                        }),
                    );
                }
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === "NEW_MESSAGE" && data.data) {
                        handleNewMessage(data.data);
                    }

                    listenersRef.current.forEach((listener) => {
                        try {
                            listener(data);
                        } catch (error) {
                            console.error("Error in WS listener:", error);
                        }
                    });
                } catch (error) {
                    console.error("WS Parse Error:", error);
                }
            };

            ws.onclose = () => {
                setIsConnected(false);
                reconnectTimeoutRef.current = setTimeout(
                    connectWebSocket,
                    3000,
                );
            };
        };

        if (userId) {
            connectWebSocket();
        }

        return () => {
            if (reconnectTimeoutRef.current)
                clearTimeout(reconnectTimeoutRef.current);
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, [userId, handleNewMessage]);

    const subscribe = useCallback((callback: (data: any) => void) => {
        listenersRef.current.add(callback);

        return () => {
            listenersRef.current.delete(callback);
        };
    }, []);

    const sendMessage = useCallback((data: MessageSend) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(data));

            return true;
        }

        return false;
    }, []);

    const joinConversation = useCallback(
        (conversationId: string) => {
            if (!userId) return;
            currentConversationRef.current = conversationId;

            if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(
                    JSON.stringify({
                        type: "JOIN",
                        userId: userId,
                        conversationId,
                    }),
                );
            }
        },
        [userId],
    );

    const leaveConversation = useCallback(
        (conversationId: string) => {
            if (!userId) return;

            if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(
                    JSON.stringify({
                        type: "LEAVE",
                        userId: userId,
                        conversationId,
                    }),
                );
            }

            if (currentConversationRef.current === conversationId) {
                currentConversationRef.current = null;
            }
        },
        [userId],
    );

    const value = useMemo(
        () => ({
            subscribe,
            sendMessage,
            isConnected,
            joinConversation,
            leaveConversation,
        }),
        [
            subscribe,
            sendMessage,
            isConnected,
            joinConversation,
            leaveConversation,
        ],
    );

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};
