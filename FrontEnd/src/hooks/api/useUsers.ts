import { useQuery, useMutation } from "@tanstack/react-query";

import { userApi } from "../../api/user.api";

import { useAuthStore } from "@/store/auth.store";

export const useSearchUsers = (query: string) => {
    return useQuery({
        queryKey: [query],
        queryFn: () => userApi.searchUsers(query),
        enabled: query.length > 0,
    });
};

export const UseChangeUserProfile = () => {
    const store = useAuthStore.getState();

    return useMutation({
        mutationFn: userApi.changeUserProfile,
        onSuccess: (data) => {
            console.log("data", data);
            store.setUser(data);
        },
        onError: () => {},
    });
};

export const useUser = (userId: string) => {
    return useQuery({
        queryKey: ["user", userId],
        queryFn: async () => userApi.getUserById(userId),

        staleTime: 1000 * 60 * 5,
        enabled: !!userId,
    });
};
