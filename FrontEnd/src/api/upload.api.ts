import { axiosClient } from "./axiosClient";

export const uploadApi = {
    uploadImageMessage: async (formData: FormData) => {
        const result = await axiosClient.post(
            "/upload/image/message",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            },
        );
        return result.data;
    },
    uploadImageAvatar: async (formData: FormData) => {
        const result = await axiosClient.patch(
            "/upload/image/avatar",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            },
        );

        return result.data;
    },
};
