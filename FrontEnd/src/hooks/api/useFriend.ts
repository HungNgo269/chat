import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { friendApi } from "@/api/friend.api";

export const useGetListFriends = () => {
    return useQuery({
        queryKey: ["friend-list"],
        queryFn: friendApi.getListFriends,
    });
};

export const useGetFriendRequests = () => {
    return useQuery({
        queryKey: ["friend-requests"],
        queryFn: friendApi.getFriendRequests,
    });
};

export const useGetUserRelationStatus = (friendId: string) => {
    return useQuery({
        queryKey: ["friend-status", friendId],
        queryFn: () => friendApi.getUserRelationStatus(friendId),
        enabled: !!friendId,
    });
};

const useInvalidateUserRelationStatus = () => {
    const queryClient = useQueryClient();

    return (friendId: string) => {
        queryClient.invalidateQueries({
            queryKey: ["friend-status", friendId],
        });
        queryClient.invalidateQueries({ queryKey: ["friend-list"] });
        queryClient.invalidateQueries({ queryKey: ["friend-requests"] });
    };
};

export const useSendFriendRequest = () => {
    const invalidate = useInvalidateUserRelationStatus();

    return useMutation({
        mutationFn: friendApi.sendFriendRequest,
        onSuccess: (_, variables) => {
            invalidate(variables);
            console.log("Đã gửi lời mời");
        },
    });
};

export const useAcceptFriendRequest = () => {
    const invalidate = useInvalidateUserRelationStatus();

    return useMutation({
        mutationFn: friendApi.acceptFriendRequest,
        onSuccess: (_, variables) => {
            invalidate(variables);
            console.log("Đã chấp nhận");
        },
    });
};

export const useCancelFriendRequest = () => {
    const invalidate = useInvalidateUserRelationStatus();

    return useMutation({
        mutationFn: friendApi.cancelFriendRequest,
        onSuccess: (_, variables) => {
            invalidate(variables);
            console.log("Đã hủy lời mời");
        },
    });
};

export const useRejectFriendRequest = () => {
    const invalidate = useInvalidateUserRelationStatus();

    return useMutation({
        mutationFn: friendApi.rejectFriendRequest,
        onSuccess: (_, variables) => {
            invalidate(variables);
            console.log("Đã từ chối");
        },
    });
};

export const useUnfriend = () => {
    const invalidate = useInvalidateUserRelationStatus();

    return useMutation({
        mutationFn: friendApi.unfriend,
        onSuccess: (_, variables) => {
            invalidate(variables);
            console.log("Đã hủy kết bạn");
        },
    });
};
