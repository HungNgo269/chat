import { memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Conversation } from "@/interfaces/conversation";
import { formatTimeFromNow } from "@/helper/dateHelper";

interface props {
    conversation: Conversation;
}

const ConversationItem = ({ conversation }: props) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleConversation = (conversationId: string) => {
        const baseUrl = location.pathname;
        const navigateUrl = baseUrl.split("/").slice(0, -1).join("/");

        navigate(`${navigateUrl}/${conversationId}`);
    };

    return (
        <button
            key={conversation.id}
            className="w-full h-16 flex flex-row items-center gap-3 hover:bg-content2 hover:cursor-pointer rounded-xl px-3 disabled:opacity-50"
            onClick={() => handleConversation(conversation.id)}
        >
            <div className="h-14 min-w-14 w-14 rounded-full overflow-hidden">
                <img
                    alt={conversation.name ?? ""}
                    className="w-full h-full object-cover"
                    src={conversation.avatar?.secureUrl ?? "/ava.jpg"}
                />
            </div>
            <div className="h-full w-full flex flex-col gap-1 justify-center overflow-hidden">
                <span className="text-md font-medium text-content1-foreground truncate text-start">
                    {conversation.name}
                </span>
                <div className="flex flex-row gap-2">
                    <span className="text-sm text-default-300 truncate flex-1 min-w-0 text-start">
                        {conversation.lastMessage === ""
                            ? "Đã gửi một ảnh"
                            : conversation.lastMessage}
                    </span>
                    {conversation.lastMessageAt && (
                        <span className="text-sm text-default-300 shrink-0 whitespace-nowrap">
                            {formatTimeFromNow(conversation.lastMessageAt)}
                        </span>
                    )}
                </div>
            </div>
        </button>
    );
};

export default memo(ConversationItem);
