import { Input } from "@heroui/input";
import { useMemo, useState } from "react";
import { Spinner } from "@heroui/spinner";

import { ConversationList } from "./conversationList";
import { FriendList } from "./friendList";

import { useDebounce } from "@/hooks/feature/useDebounce";
import { UseGetRecentConversation } from "@/hooks/api/useConversation";
import { useSearchUsers } from "@/hooks/api/useUsers";
import { Conversation } from "@/interfaces/conversation";

export const SideBar = () => {
    const [query, setQuery] = useState("");
    const debounceQuery = useDebounce(query, 300);

    const {
        data: conversations,
        isLoading: isConversationsLoading,
        isError: isConversationsError,
        error: conversationsError,
    } = UseGetRecentConversation();
    const {
        data: friends,
        isLoading: isFriendsLoading,
        isError: isFriendsError,
        error: friendsError,
    } = useSearchUsers(debounceQuery);

    const isSearching = debounceQuery.length > 0;

    console.log("side conversations", conversations);

    const sortedConversationFunction = useMemo(() => {
        if (!conversations) {
            return [];
        }

        return [...conversations].sort((a: Conversation, b: Conversation) => {
            if (!a.lastMessageAt) return 1;

            if (!b.lastMessageAt) return -1;
            const dateA = new Date(a.lastMessageAt);
            const dateB = new Date(b.lastMessageAt);

            return dateB.getTime()! - dateA.getTime();
        });
    }, [conversations]);

    return (
        <div className="hidden md:flex flex-col gap-3 px-4 py-3 md:w-[300px] lg:w-[360px] bg-content1 overflow-y-scroll">
            <div className="">
                <span className="text-2xl font-bold text-content1-foreground">
                    Đoạn chat
                </span>
            </div>

            <Input
                placeholder="Tìm kiếm..."
                type="text"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                }}
            />

            {(isConversationsLoading || isFriendsLoading) && (
                <div className="flex justify-center items-center py-8">
                    <Spinner color="primary" size="lg" />
                </div>
            )}

            {!isConversationsLoading && !isFriendsLoading && (
                <>
                    {isSearching ? (
                        <>
                            {isFriendsError ? (
                                <div className="flex flex-col items-center justify-center py-8 gap-2">
                                    <span className="text-danger text-sm">
                                        {(friendsError as any)?.message ||
                                            "Có lỗi xảy ra khi tìm kiếm"}
                                    </span>
                                </div>
                            ) : (
                                <FriendList
                                    friendList={friends || []}
                                    isLoading={isFriendsLoading}
                                />
                            )}
                        </>
                    ) : (
                        <>
                            {isConversationsError ? (
                                <div className="flex flex-col items-center justify-center py-8 gap-2">
                                    <span className="text-danger text-sm">
                                        {(conversationsError as any)?.message ||
                                            "Có lỗi xảy ra khi tải đoạn chat"}
                                    </span>
                                </div>
                            ) : (
                                <ConversationList
                                    conversationList={
                                        sortedConversationFunction || []
                                    }
                                    isLoading={isConversationsLoading}
                                />
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};
