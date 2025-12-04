import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { X } from "lucide-react";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Spinner } from "@heroui/spinner";

import { UserAvatar } from "@/interfaces/user";
import {
    useAcceptFriendRequest,
    useCancelFriendRequest,
    useGetUserRelationStatus,
    useRejectFriendRequest,
    useSendFriendRequest,
    useUnfriend,
} from "@/hooks/api/useFriend";
import { UserRelationStatus } from "@/interfaces/enums";

interface ChatInfoProps {
    friend: UserAvatar;
    isOpen: boolean;
    onClose: () => void;
}

export const ChatInfo = ({ friend, isOpen, onClose }: ChatInfoProps) => {
    const { data: statusData, isLoading: isLoadingStatus } =
        useGetUserRelationStatus(friend?.id);

    const sendMutation = useSendFriendRequest();
    const acceptMutation = useAcceptFriendRequest();
    const cancelMutation = useCancelFriendRequest();
    const rejectMutation = useRejectFriendRequest();
    const unfriendMutation = useUnfriend();

    const isGlobalPending =
        sendMutation.isPending ||
        acceptMutation.isPending ||
        cancelMutation.isPending ||
        rejectMutation.isPending ||
        unfriendMutation.isPending;

    if (!isOpen || !friend) return null;
    const renderActionButtons = () => {
        if (isLoadingStatus) return <Spinner size="sm" />;

        switch (statusData) {
            case UserRelationStatus.FRIEND:
                return (
                    <Button
                        color="danger"
                        isDisabled={isGlobalPending}
                        isLoading={unfriendMutation.isPending}
                        variant="flat"
                        onPress={() => unfriendMutation.mutate(friend.id)}
                    >
                        Hủy kết bạn
                    </Button>
                );

            case UserRelationStatus.SENT:
                return (
                    <Button
                        color="default"
                        isDisabled={isGlobalPending}
                        isLoading={cancelMutation.isPending}
                        variant="faded"
                        onPress={() => cancelMutation.mutate(friend.id)}
                    >
                        Hủy lời mời
                    </Button>
                );

            case UserRelationStatus.RECEIVED:
                return (
                    <div className="flex gap-2 w-full justify-center">
                        <Button
                            color="primary"
                            isDisabled={isGlobalPending}
                            isLoading={acceptMutation.isPending}
                            onPress={() => acceptMutation.mutate(friend.id)}
                        >
                            Chấp nhận
                        </Button>
                        <Button
                            color="danger"
                            isDisabled={isGlobalPending}
                            isLoading={rejectMutation.isPending}
                            variant="light"
                            onPress={() => rejectMutation.mutate(friend.id)}
                        >
                            Từ chối
                        </Button>
                    </div>
                );

            case UserRelationStatus.NOT_FRIEND:
            default:
                return (
                    <Button
                        color="primary"
                        isDisabled={isGlobalPending}
                        isLoading={sendMutation.isPending}
                        onPress={() => sendMutation.mutate(friend.id)}
                    >
                        Thêm bạn bè
                    </Button>
                );
        }
    };

    return (
        <div className="h-full w-[300px] bg-content1 border-l border-divider flex flex-col transition-all duration-300 ease-in-out rounded-md">
            <div className="flex items-center justify-between p-4 border-b border-divider w-full">
                <h3 className="font-semibold text-lg">Thông tin</h3>
                <Button isIconOnly size="sm" variant="light" onPress={onClose}>
                    <X size={20} />
                </Button>
            </div>

            <ScrollShadow className="flex-1 p-6 flex flex-col items-center gap-4 overflow-x-hidden">
                <Avatar
                    isBordered
                    className="w-24 h-24 text-large"
                    color="primary"
                    src={friend.avatar?.secureUrl || "ava.jpg"}
                />

                <div className="text-center">
                    <h2 className="text-xl font-bold">{friend.name}</h2>
                </div>

                <Divider className="my-2" />

                <div className="w-full flex justify-center">
                    {renderActionButtons()}
                </div>
            </ScrollShadow>
        </div>
    );
};
