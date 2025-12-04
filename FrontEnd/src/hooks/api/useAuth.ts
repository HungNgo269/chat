import { useMutation, useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/store/auth.store";
import { authApi } from "@/api/auth.api";

export const UseLogin = () => {
    const store = useAuthStore.getState();

    return useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            store.setUser(data);
        },
        onError: (error) => {
            console.error("Login failed:", error.message);
        },
    });
};
export const UseRegister = () => {
    return useMutation({
        mutationFn: authApi.register,
    });
};
export const useAuthCheck = () => {
    return useQuery({
        queryKey: ["auth-check"],
        queryFn: () => authApi.checkAuth,
        refetchInterval: 15 * 60 * 1000,
        refetchIntervalInBackground: true,
        enabled: useAuthStore((state) => state.isAuthenticated),
    });
};
