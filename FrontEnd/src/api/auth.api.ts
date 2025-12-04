import { axiosClient } from "./axiosClient";

import { useTokenStore } from "@/store/token.store";
import { useAuthStore } from "@/store/auth.store";

export const authApi = {
    login: async (payload: { email: string; password: string }) => {
        const result = await axiosClient.post("/auth/login", payload);
        const user = result.data.user;

        useTokenStore.getState().setAccessToken(result.data.access_token);
        console.log("user", user);

        return user;
    },
    register: async (payload: {
        email: string;
        name: string;
        password: string;
    }) => {
        const result = await axiosClient.post("/auth/register", payload);

        return result.data;
    },
    logout: async () => {
        const result = await axiosClient.get("/auth/logout");

        return result.data;
    },
    checkAuth: async () => {
        const response = await axiosClient.post("/auth/me");
        console.log("res", response);

        if (response.data) {
            useAuthStore.getState().setUser(response.data.user);

            return response.data;
        } else {
            useAuthStore.getState().clearUser();
        }
    },
    refreshToken: async () => {
        const response = await axiosClient.post("/auth/refresh");

        if (response.data) {
            return response.data;
        } else {
            useAuthStore.getState().clearUser();
        }
    },
};
