import { create } from "zustand";

import { axiosClient } from "@/api/axiosClient";
import { User } from "@/interfaces/user";
import { Conversation } from "@/interfaces/conversation";

type State = {
  conversation: Conversation | null;
  isLoading: boolean;
  error: string | null;
};
type Action = {
  newMessage: (conversationId: string) => Promise<void>;
};

export const useConversationStore = create<State & Action>((set) => ({
  conversation: null,
  isLoading: false,
  error: null,
  newMessage: async (conversationId) => {
    set({ isLoading: true, error: null });
    // try {
    //   const response = await axiosClient.post("/auth/login", {
    //     email,
    //     password,
    //   });

    //   set({
    //     user: response.data.user,
    //     isAuthenticated: true,
    //     isLoading: false,
    //   });
    // } catch (error: any) {
    //   const message = error.response?.data?.message || "Đã có lỗi xảy ra";

    //   set({ error: message, isLoading: false });
    //   throw error;
    // }
  },
}));
