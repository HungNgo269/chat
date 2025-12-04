import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/auth.store";
import { useAuthCheck } from "./hooks/api/useAuth";
import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./pages/auth/protectedRoute";
import ChatPage from "./pages/chatPage";
import LoginPage from "./pages/auth/loginPage";
import RegisterPage from "./pages/auth/registerPage";
import UserProfile from "./components/user/userProfile";
import { IndexPage } from "./pages";

export default function AppContent() {
    const isLoading = useAuthStore((state) => state.isLoading);

    useAuthCheck();
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-right" />
            <Routes>
                <Route
                    element={
                        <ProtectedRoute>
                            <IndexPage />
                        </ProtectedRoute>
                    }
                    path="/"
                />
                <Route
                    element={
                        <ProtectedRoute>
                            <ChatPage />
                        </ProtectedRoute>
                    }
                    path="/:conversationId"
                />
                <Route
                    element={
                        <ProtectedRoute>
                            <UserProfile />
                        </ProtectedRoute>
                    }
                    path="/me"
                />
                <Route element={<LoginPage />} path="/login" />
                <Route element={<RegisterPage />} path="/register" />
            </Routes>
        </>
    );
}
