import { memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { UseGetOrCreateConversation } from "@/hooks/api/useConversation";
import { User } from "@/interfaces/user";

interface props {
    friend: User;
}

const FriendItem = ({ friend }: props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { mutate, isPending } = UseGetOrCreateConversation();

    const handleConversation = (friendId: string) => {
        mutate(
            { friendId },
            {
                onSuccess: (response) => {
                    const baseUrl = location.pathname;
                    const navigateUrl = baseUrl
                        .split("/")
                        .slice(0, -1)
                        .join("/");

                    navigate(`${navigateUrl}/${response.conversation.id}`);
                },
            },
        );
    };

    return (
        <button
            key={friend.id}
            className="w-full h-16 flex flex-row items-center gap-3 hover:bg-content2 hover:cursor-pointer rounded-xl px-3 disabled:opacity-50"
            disabled={isPending}
            onClick={() => handleConversation(friend.id)}
        >
            <div className="h-14 min-w-14 w-14 rounded-full overflow-hidden">
                <img
                    alt={friend.name}
                    className="w-full h-full object-cover"
                    src={friend.avatar.secureUrl ?? "/ava.jpg"}
                />
            </div>
            <div className="h-full w-full flex flex-col gap-1 justify-center overflow-hidden">
                <span className="text-md font-medium text-content1-foreground truncate">
                    {friend.name}
                </span>
            </div>
        </button>
    );
};

export default memo(FriendItem);
