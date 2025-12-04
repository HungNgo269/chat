import { axiosClient } from "./axiosClient";

export const messageApi = {
    getMessage: async (data: { conversationId: string; page: number }) => {
        const result = await axiosClient.post("/message/", data);
        return result.data;
    },
    sendMessage: async (data: {
        conversationId: string;
        receiverId: string;
        text?: string;
    }) => {
        const result = await axiosClient.post("/message/send", data);
        return result.data;
    },
};
