import { useEffect } from "react";

import { LoginForm } from "@/components/auth/loginForm";
import { useAuthStore } from "@/store/auth.store";
export default function LoginPage() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        const checkLogin = () => {
            if (isAuthenticated || user) {
            }
        };

        checkLogin();
    }, [isAuthenticated]);

    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center bg-background text-foreground">
            <LoginForm />
        </div>
    );
}
