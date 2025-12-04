import {
    Navbar as HeroUINavbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
} from "@heroui/navbar";
import { Info } from "lucide-react";
import { Spinner } from "@heroui/spinner";
import { User } from "@heroui/user";

import { UserAvatar } from "@/interfaces/user";

interface ChatNavbarProps {
    friend?: UserAvatar;
    isLoading: boolean;
    onToggleInfo: () => void;
}

export const ChatNavbar = ({
    friend,
    isLoading,
    onToggleInfo,
}: ChatNavbarProps) => {
    return (
        <HeroUINavbar
            className="bg-default-100 border-b border-divider  rounded-t-md "
            maxWidth="full"
            position="sticky"
        >
            <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
                <NavbarBrand className="gap-3 max-w-fit">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-2">
                            <Spinner color="primary" size="sm" />
                        </div>
                    ) : (
                        friend && (
                            <User
                                avatarProps={{
                                    src: friend.avatar?.secureUrl || "ava.jpg",
                                }}
                                classNames={{
                                    name: "font-semibold",
                                }}
                                // description="Online"
                                name={friend.name}
                            />
                        )
                    )}
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent
                className="hidden sm:flex basis-1/5 sm:basis-full"
                justify="end"
            >
                <NavbarItem
                    className="cursor-pointer active:opacity-50 hover:bg-default-200 p-2 rounded-full transition-colors"
                    onClick={onToggleInfo}
                >
                    <Info size={20} />
                </NavbarItem>
            </NavbarContent>
        </HeroUINavbar>
    );
};
