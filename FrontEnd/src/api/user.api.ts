import { axiosClient } from "./axiosClient";

import { UpdateProfileData, User } from "@/interfaces/user";

export const userApi = {
    searchUsers: async (query: string) => {
        const result = await axiosClient.get(`/users/search?query=${query}`);
        console.log("search", result);
        return result.data;
    },
    changeUserProfile: async (data: UpdateProfileData) => {
        const response = await axiosClient.patch("/users/profile", data);
        return response.data;
    },

    //crud admin
    getUsers: async () => {
        const result = await axiosClient.get("/users");
        return result.data;
    },

    getUserById: async (id: string) => {
        const result = await axiosClient.get(`/users/${id}`);
        console.log("getuserbyID", result.data);
        return result.data as User;
    },

    createUser: async (data: { name: string; email: string }) => {
        const result = await axiosClient.post("/users", data);
        return result.data;
    },

    deleteUser: async (id: string) => {
        const result = await axiosClient.delete(`/users/${id}`);
        return result.data;
    },
};
