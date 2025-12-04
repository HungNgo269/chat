import { Avatar } from "@heroui/avatar";
import { Link } from "@heroui/link";
import {
    Navbar as HeroUINavbar,
    NavbarBrand,
    NavbarContent,
} from "@heroui/navbar";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from "@heroui/dropdown";
import { useNavigate } from "react-router-dom";

import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";
import { useAuthStore } from "@/store/auth.store";
import { authApi } from "@/api/auth.api";
export const Navbar = () => {
    const items = [
        {
            key: "info",
            label: "Thông tin cá nhân",
        },
        {
            key: "logout",
            label: "Đăng xuất",
        },
    ];
    const store = useAuthStore.getState();
    const user = useAuthStore.getState().user;
    const navigate = useNavigate();
    const handleLogout = async () => {
        await authApi.logout();
        store.clearUser();
        window.location.href = "/login";
    };
    const handleInfo = () => {
        navigate("/me");
    };

    return (
        <HeroUINavbar height="4rem" maxWidth="xl" position="sticky">
            <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
                <NavbarBrand className="gap-3 max-w-fit">
                    <Link
                        className="flex justify-start items-center gap-1"
                        color="foreground"
                        href="/"
                    >
                        <Logo />
                        <p className="font-bold text-inherit">Chat</p>
                    </Link>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent justify="end">
                <ThemeSwitch />
                <Dropdown>
                    <DropdownTrigger>
                        <button className="hover:cursor-pointer">
                            <Avatar
                                name="ava"
                                src={user?.avatar.secureUrl ?? `/ava.jpg`}
                            />
                        </button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Dynamic Actions" items={items}>
                        {(item) => (
                            <DropdownItem
                                key={item.key}
                                className={
                                    item.key === "logout" ? "text-danger" : ""
                                }
                                color={
                                    item.key === "logout" ? "danger" : "default"
                                }
                                onClick={() => {
                                    item.key === "logout"
                                        ? handleLogout()
                                        : handleInfo();
                                }}
                            >
                                <button className="hover:cursor-pointer">
                                    {item.label}
                                </button>
                            </DropdownItem>
                        )}
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>
        </HeroUINavbar>
    );
};
