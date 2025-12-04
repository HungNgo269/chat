import { Spinner } from "@heroui/spinner";

import ConversationItem from "./conversationItem";

import { Conversation } from "@/interfaces/conversation";

interface props {
    conversationList: Conversation[];
    isLoading: boolean;
}

export const ConversationList = ({ conversationList, isLoading }: props) => {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-8">
                <Spinner color="primary" size="lg" />
            </div>
        );
    }

    if (conversationList.length === 0) {
        return (
            <div className="flex justify-center items-center py-8">
                <span className="text-default-400 text-sm">
                    Chưa có đoạn chat nào
                </span>
            </div>
        );
    }

    return (
        <>
            {conversationList.map((conversation: Conversation) => (
                <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                />
            ))}
        </>
    );
};
