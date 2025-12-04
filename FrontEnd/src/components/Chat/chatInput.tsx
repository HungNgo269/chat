import { Input } from "@heroui/input";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Images, Send } from "lucide-react";

import { FilePreview } from "./chatInputFilePreview";

import { useAuthStore } from "@/store/auth.store";
import { MessageSend } from "@/interfaces/message";
import { AttachmentType, MessageStatus } from "@/interfaces/enums";
import { useWebSocketContext } from "@/context/WebSocketContext";
import { uploadApi } from "@/api/upload.api";
import { Attachment } from "@/interfaces/attachment";

export const ChatInput = () => {
    const [inputText, setInputText] = useState<string>("");
    const currentUser = useAuthStore.getState().user;
    const { conversationId } = useParams<{ conversationId: string }>();
    const { sendMessage, isConnected } = useWebSocketContext();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleImageSelect = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;
        setSelectedFile(file);
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async () => {
        if (inputText.trim() === "" && !selectedFile) return;

        setIsLoading(true);
        if (!currentUser || !conversationId || !isConnected) {
            setIsLoading(false);

            return;
        }

        if (selectedFile) {
            const formData = new FormData();

            formData.append("MessageImage", selectedFile);
            formData.append("conversationId", conversationId);

            try {
                const uploadResult =
                    await uploadApi.uploadImageMessage(formData);
                const uploadedData = uploadResult;
                const uploadedImage: Attachment = {
                    publicId: uploadedData.public_id,
                    secure_url: uploadedData.secure_url,
                    height: uploadedData.height,
                    width: uploadedData.width,
                    type: AttachmentType.IMAGE,
                };

                const data: MessageSend = {
                    type: MessageStatus.send,
                    senderId: currentUser?.id,
                    text: inputText,
                    conversationId: conversationId,
                    attachments: uploadedImage,
                };

                sendMessage(data);
                setInputText("");
                handleRemoveFile();
            } catch (error) {
                console.error("File upload error:", error);
            } finally {
                setIsLoading(false);
            }
        } else {
            const data: MessageSend = {
                type: MessageStatus.send,
                senderId: currentUser?.id,
                text: inputText,
                conversationId: conversationId,
            };
            sendMessage(data);
            setInputText("");
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="w-full flex items-center gap-1.5 sm:gap-2 p-2 sm:p-3 ">
            <button
                className="p-1.5 sm:p-2 rounded-full hover:bg-default-200 transition-colors flex-shrink-0 "
                disabled={isLoading}
                type="button"
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleImageSelect}
                />
                <Images className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
            </button>

            <div className="flex-1 flex items-center gap-2 min-w-0">
                {selectedFile && (
                    <FilePreview
                        file={selectedFile}
                        onRemove={handleRemoveFile}
                    />
                )}

                <Input
                    className="flex-1  bg-default-100 border-none min-w-0 text-sm sm:text-base rounded-2xl"
                    disabled={!isConnected || isLoading}
                    placeholder="Aa"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
            </div>

            <button
                className="p-1.5 sm:p-2 rounded-full flex-shrink-0 hover:cursor-pointer text-foreground"
                disabled={isLoading || (!inputText.trim() && !selectedFile)}
                type="button"
                onClick={handleSubmit}
            >
                <Send className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
        </div>
    );
};
