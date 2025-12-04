import { axiosClient } from "./axiosClient";

export const conversationApi = {
    getConversation: async (data: { conversationId: string }) => {
        const result = await axiosClient.post("conversation/get", data);
        return result.data;
    },

    getOrCreateConversation: async (data: { friendId: string }) => {
        const result = await axiosClient.post(
            "conversation/get-or-create",
            data,
        );

        return result.data;
    },

    createConversation: async (data: { userId: string; friendId: string }) => {
        const result = await axiosClient.post("conversation/create", data);
        return result.data;
    },
    addUserToConversation: async (
        data: { userId: string; friendId: string },
        conversationId: string,
    ) => {
        const result = await axiosClient.post(
            `conversation/${conversationId}/add`,
            data,
        );
        return result.data;
    },
    getRecentConversation: async () => {
        const response = await axiosClient.get(`conversation/get-recent`);
        return response.data;
    },
    getConversationParticipants: async (data: { conversationId: string }) => {
        const result = await axiosClient.post(
            `conversation/get-participants`,
            data,
        );

        return result.data;
    },
};
