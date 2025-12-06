import {
    Navbar as HeroUINavbar,
    NavbarContent,
    NavbarItem,
} from "@heroui/navbar";

import { ChatInput } from "./chatInput";

export const ChatToolbar = () => {
    return (
        <HeroUINavbar
            className="bg-default-300   rounded-b-md "
            maxWidth="full"
        >
            {/* <NavbarContent
                className="basis-1/6 flex-shrink-0 !flex-grow-0"
                justify="start"
            >
                <NavbarItem>
                    <Mic />
                </NavbarItem>
                <NavbarItem>
                    <PhoneCall />
                </NavbarItem>
            </NavbarContent> */}

            <NavbarContent className="flex-1">
                <NavbarItem className="w-full relative">
                    <ChatInput />
                </NavbarItem>
            </NavbarContent>
        </HeroUINavbar>
    );
};
