import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { LoginForm } from "@/components/auth/loginForm";
import { useAuthStore } from "@/store/auth.store";
export default function LoginPage() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);

    const navigate = useNavigate();

    useEffect(() => {
        const checkLogin = () => {
            if (isAuthenticated || user) {
                console.log("ok");
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
