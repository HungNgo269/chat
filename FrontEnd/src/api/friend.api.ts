import { axiosClient } from "./axiosClient";

export const friendApi = {
    getListFriends: async () => {
        const result = await axiosClient.get("/friend/list");

        return result.data;
    },

    getFriendRequests: async () => {
        const result = await axiosClient.get("/friend/requests");

        return result.data;
    },

    getUserRelationStatus: async (friendId: string) => {
        const result = await axiosClient.get(`/friend/status/${friendId}`);
        return result.data;
    },
    sendFriendRequest: async (friendId: string) => {
        const result = await axiosClient.post("/friend/send", { friendId });

        return result.data;
    },

    acceptFriendRequest: async (friendId: string) => {
        const result = await axiosClient.patch("/friend/accept", { friendId });

        return result.data;
    },

    cancelFriendRequest: async (friendId: string) => {
        const result = await axiosClient.delete(`/friend/cancel/${friendId}`);

        return result.data;
    },

    rejectFriendRequest: async (friendId: string) => {
        const result = await axiosClient.delete(`/friend/reject/${friendId}`);

        return result.data;
    },

    unfriend: async (friendId: string) => {
        const result = await axiosClient.delete(`/friend/${friendId}`);

        return result.data;
    },
};
