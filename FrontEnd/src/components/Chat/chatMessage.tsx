import { useRef } from "react";
import { useParams } from "react-router-dom";

import { MessageBubble } from "../message.tsx/messageBubble";

import { Message } from "@/interfaces/message";
import { useAuthStore } from "@/store/auth.store";
import { useMessageWebSocket } from "@/hooks/feature/useMessageWebSocket";
import { useInfiniteScrollObserver } from "@/hooks/feature/useInfiniteScrollObserver";
import { useConversationConnection } from "@/hooks/feature/useConversationConnection";
import { useMessages } from "@/hooks/api/useMessage";

export const ChatMessage = () => {
    const { conversationId } = useParams();
    const user = useAuthStore((state) => state.user!);
    const midMessageRef = useRef<HTMLDivElement>(null);
    const messageContainerRef = useRef<HTMLDivElement | null>(null);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
        useMessages(conversationId);

    useConversationConnection(conversationId);

    useMessageWebSocket(conversationId);

    useInfiniteScrollObserver({
        triggerRef: midMessageRef,
        containerRef: messageContainerRef,
        onLoadMore: fetchNextPage,
        hasNextPage: hasNextPage ?? false,
        isFetchingNextPage,
    });

    // Flatten messages từ pages
    const messages = data?.pages.flatMap((page: Message) => page) ?? [];

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="relative h-full">
            <div
                ref={messageContainerRef}
                className="w-full h-full flex overflow-y-scroll overflow-x-hidden flex-col-reverse pb-2 px-2"
            >
                <div className="flex flex-col-reverse w-full gap-3 h-full">
                    {messages.map((message: Message, index: number) => (
                        <MessageBubble
                            key={message.id}
                            ref={
                                messages.length - 10 === index
                                    ? midMessageRef
                                    : null
                            }
                            currentUser={user}
                            message={message}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
