import { create } from "zustand";

type State = {
    access_token: string;
};

type Action = {
    setAccessToken: (token: string) => void;
};

export const useTokenStore = create<Action & State>()((set) => ({
    access_token: "",
    setAccessToken: (token: string) => {
        set({ access_token: token });
    },
}));
