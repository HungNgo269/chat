import { Avatar } from "@heroui/avatar";
import { Image } from "@heroui/image";
import { forwardRef } from "react";

import { Message } from "@/interfaces/message";
import { User } from "@/interfaces/user";
import { useUser } from "@/hooks/api/useUsers";

interface MessageBubbleProps {
    message: Message;
    currentUser: User;
}
//ref type, propsn type
export const MessageBubble = forwardRef<HTMLDivElement, MessageBubbleProps>(
    ({ message, currentUser }, ref) => {
        const isCurrentUser = message.senderId === currentUser.id;
        const { data: user } = useUser(message.senderId);

        console.log("data", user, message.senderId);

        return (
            <div
                ref={ref}
                className={`max-w-xl flex flex-row gap-2 h-fit ${
                    isCurrentUser
                        ? "flex-row-reverse ml-auto"
                        : "flex-row mr-auto"
                }`}
            >
                <Avatar
                    className="min-w-10 min-h-10"
                    name="ava"
                    src={
                        isCurrentUser
                            ? (currentUser.avatar.secureUrl ?? "ava.jpg")
                            : (user?.avatar?.secureUrl ?? "ava.jpg")
                    }
                />

                <div className="flex flex-col min-w-0 max-w-full items-start gap-1">
                    {message.attachments?.secure_url && (
                        <Image
                            alt={message.text || "Hình ảnh"}
                            className="max-w-[300px] h-auto rounded-lg"
                            // height={message.attachments.height!}
                            src={message.attachments.secure_url}
                            // width={message.attachments.width!}
                        />
                    )}
                    {message.text && message.text.length > 0 && (
                        <span className="inline-block max-w-[500px] py-2 pl-2 pr-3 break-words bg-focus text-white rounded-3xl ml-auto">
                            {message.text}
                        </span>
                    )}
                </div>
            </div>
        );
    },
);

MessageBubble.displayName = "MessageBubble";
