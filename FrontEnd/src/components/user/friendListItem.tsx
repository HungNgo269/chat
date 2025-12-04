import { Button } from "@heroui/button";
import { User } from "@heroui/user";
import { UserMinus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { UserAvatar } from "@/interfaces/user";
import { useUnfriend } from "@/hooks/api/useFriend";
import { UseGetOrCreateConversation } from "@/hooks/api/useConversation";

interface props {
    friend: UserAvatar;
}

export const FriendListItem = ({ friend }: props) => {
    const unfriendMutation = useUnfriend();
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
            className="flex items-center hover:cursor-pointer justify-between p-3 bg-content1 rounded-xl shadow-sm hover:bg-content2 transition-all"
            disabled={isPending}
            onClick={() => handleConversation(friend.id)}
        >
            <User
                avatarProps={{
                    src: friend.avatar.secureUrl ?? "/ava.jpg",
                    size: "md",
                    isBordered: true,
                }}
                className="justify-start"
                description="Đang hoạt động"
                name={friend.name}
            />

            <Button
                isIconOnly
                aria-label="Hủy kết bạn"
                className="z-10"
                color="danger"
                disabled={unfriendMutation.isPending}
                isLoading={unfriendMutation.isPending}
                variant="light"
                onPress={() => unfriendMutation.mutate(friend.id)}
            >
                <UserMinus size={20} />
            </Button>
        </button>
    );
};
