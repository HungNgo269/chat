import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { conversationApi } from "@/api/conversation.api";

export const UseGetOrCreateConversation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { friendId: string }) =>
            conversationApi.getOrCreateConversation(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["conversation"],
            }); //đánh dấu data lỗi thời => cần fetch lại
        },
        onError: (error: any) => {
            toast.error(error.message || "Có lỗi xảy ra");
        },
    });
};

export const UseGetRecentConversation = () => {
    return useQuery({
        queryKey: ["conversation"],
        queryFn: () => conversationApi.getRecentConversation(),
    });
};

export const UseGetConversation = (data: { conversationId: string }) => {
    return useQuery({
        queryKey: ["conversation", data.conversationId],
        queryFn: () => conversationApi.getConversation(data),
        enabled: !!data.conversationId,
    });
};
export const UseGetConversationParticipants = (data: {
    conversationId: string;
}) => {
    return useQuery({
        queryKey: ["conversation-participants", data.conversationId],
        queryFn: () => conversationApi.getConversationParticipants(data),
        enabled: !!data.conversationId,
    });
};
