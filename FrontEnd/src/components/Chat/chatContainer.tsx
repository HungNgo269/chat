import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { ChatNavbar } from "./chatNav";
import { ChatToolbar } from "./chatToolbar";
import { ChatInfo } from "./chatInfo";

import { UserAvatar } from "@/interfaces/user";
import { useAuthStore } from "@/store/auth.store";
import { UseGetConversationParticipants } from "@/hooks/api/useConversation";
import { ChatMessage } from "./chatMessage";

export const ChatContainer = () => {
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const { conversationId } = useParams();
    const navigate = useNavigate();

    const currentUserId = useAuthStore((state) => state.user?.id);

    useEffect(() => {
        if (!conversationId) {
            navigate("/login");
        }
    }, [conversationId, navigate]);

    const { data: conversations, isLoading: isConversationsLoading } =
        UseGetConversationParticipants({
            conversationId: conversationId || "",
        });

    const friend = useMemo(() => {
        if (!conversations || !currentUserId) return undefined;

        return conversations.find(
            (user: UserAvatar) => user.id !== currentUserId,
        );
    }, [conversations, currentUserId]);

    return (
        <div className="flex w-full h-full overflow-hidden flex-row gap-3 bg-background">
            <div className="flex flex-col flex-1 min-w-0 h-full relative">
                <ChatNavbar
                    friend={friend}
                    isLoading={isConversationsLoading}
                    onToggleInfo={() => setIsInfoOpen(!isInfoOpen)}
                />

                <div className="flex flex-col overflow-y-auto flex-1 bg-background">
                    <ChatMessage />
                </div>

                <ChatToolbar />
            </div>

            {isInfoOpen && (
                <ChatInfo
                    friend={friend}
                    isOpen={isInfoOpen}
                    onClose={() => setIsInfoOpen(false)}
                />
            )}
        </div>
    );
};
