import axios, {
    AxiosError,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";

import { authApi } from "./auth.api";

import { useTokenStore } from "@/store/token.store";

export const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});
axiosClient.interceptors.request.use(
    (config) => {
        const accessToken = useTokenStore.getState().access_token;

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error),
);
let isRefreshing = false;

interface QueueItem {
    resolve: (token: string) => void;
    reject: (error: any) => void;
}

let failedQueue: QueueItem[] = [];

const processQueue = (error: any = null, token: string | null = null): void => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token!);
        }
    });
    failedQueue = [];
};

// Response interceptor
axiosClient.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response.data?.success && response.data?.data) {
            return response.data;
        }

        return response.data;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        if (
            originalRequest.url?.includes("/auth/login") ||
            originalRequest.url?.includes("/auth/register") ||
            originalRequest.url?.includes("/auth/logout") ||
            originalRequest.url?.includes("/auth/me") ||
            originalRequest.url?.includes("/auth/refresh")
        ) {
            return Promise.reject(error);
        }
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            if (originalRequest.headers) {
                                originalRequest.headers.Authorization = `Bearer ${token}`;
                            }
                            resolve(axiosClient(originalRequest));
                        },
                        reject: (err: any) => {
                            reject(err);
                        },
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newAccessToken = await authApi.refreshToken();

                useTokenStore.getState().setAccessToken(newAccessToken);

                // Xử lý hàng đợi các request đang chờ
                processQueue(null, newAccessToken);

                // Xử lý request gốc (cái đầu tiên bị lỗi)
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }

                return axiosClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);

                // Logout logic here
                // Example: useAuthStore.getState().logout();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);
