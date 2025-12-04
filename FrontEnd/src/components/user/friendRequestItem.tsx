import { Button } from "@heroui/button";
import { User } from "@heroui/user";
import { useLocation, useNavigate } from "react-router-dom";

import { friendRequest } from "@/interfaces/user";
import {
    useAcceptFriendRequest,
    useRejectFriendRequest,
} from "@/hooks/api/useFriend";
import { UseGetOrCreateConversation } from "@/hooks/api/useConversation";
interface props {
    friend: friendRequest;
}
export const FriendRequestItem = ({ friend }: props) => {
    const acceptMutation = useAcceptFriendRequest();
    const rejectMutation = useRejectFriendRequest();
    const getOrCreateMutation = UseGetOrCreateConversation();

    const isGlobalPending =
        acceptMutation.isPending ||
        rejectMutation.isPending ||
        getOrCreateMutation.isPending;
    const navigate = useNavigate();
    const location = useLocation();

    const handleConversation = (friendId: string) => {
        getOrCreateMutation.mutate(
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
            className="flex items-center justify-between hover:cursor-pointer p-3 bg-content1 rounded-xl shadow-sm hover:bg-content2 transition-all"
            onClick={() => handleConversation(friend.requester.id)}
        >
            <User
                avatarProps={{
                    src: friend.requester.avatar.secureUrl ?? "ava.jpg",
                    size: "md",
                    isBordered: true,
                    color: "primary",
                }}
                className="justify-start"
                description="Muốn kết bạn với bạn"
                name={friend.requester.name}
            />

            <div className="flex gap-2">
                <Button
                    color="primary"
                    isDisabled={isGlobalPending}
                    isLoading={acceptMutation.isPending}
                    size="sm"
                    onPress={() => acceptMutation.mutate(friend.requester.id)}
                >
                    Đồng ý
                </Button>
                <Button
                    color="danger"
                    isDisabled={isGlobalPending}
                    isLoading={rejectMutation.isPending}
                    size="sm"
                    variant="flat"
                    onPress={() => rejectMutation.mutate(friend.requester.id)}
                >
                    Từ chối
                </Button>
            </div>
        </button>
    );
};
