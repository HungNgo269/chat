import React, { useState, useRef } from "react";
import { Camera } from "lucide-react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import { Spinner } from "@heroui/spinner";

import { EditProfileModal, FieldType } from "./editProfileModal";

import DefaultLayout from "@/layouts/default";
import { useAuthStore } from "@/store/auth.store";
import { User } from "@/interfaces/user";
import { uploadApi } from "@/api/upload.api";

const SETTINGS_FIELDS: FieldType[] = [
    {
        id: "name",
        label: "Tên hiển thị",
        type: "text",
        description: "Tên này sẽ hiển thị với mọi người.",
    },
    {
        id: "email",
        label: "Email",
        type: "email",
        description: "Email dùng để đăng nhập và nhận thông báo.",
    },
    {
        id: "password",
        label: "Mật khẩu",
        type: "password",
        description: "Đổi mật khẩu đăng nhập.",
    },
];

export default function UserProfile() {
    const store = useAuthStore.getState();
    const user: User = useAuthStore((state) => state.user!);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [editingField, setEditingField] = useState<FieldType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleEditClick = (field: FieldType) => {
        setEditingField(field);
        onOpen();
    };

    const handleAvatarClick = () => fileInputRef.current?.click();

    const handleAvatarChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];

        if (e.target) e.target.value = "";

        if (file) {
            setIsLoading(true);
            const formData = new FormData();

            formData.append("AvatarImage", file);

            try {
                const uploadResult =
                    await uploadApi.uploadImageAvatar(formData);
                const uploadedData = uploadResult;

                store.setUser({
                    ...user,
                    avatar: {
                        publicId: uploadedData.public_id,
                        secureUrl: uploadedData.secure_url,
                    },
                });
            } catch (error) {
                console.error("File upload error:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <DefaultLayout>
            <div className="min-h-screen bg-background pb-36 flex items-center justify-center">
                <Card className="w-full max-w-2xl bg-content-1 backdrop-blur-lg border border-divider">
                    <CardHeader className="flex flex-col gap-4 pb-0">
                        <div className="flex flex-col items-center gap-4 w-full pt-6">
                            <button
                                className="relative group cursor-pointer outline-none"
                                disabled={isLoading}
                                onClick={handleAvatarClick}
                            >
                                <Avatar
                                    className="w-24 h-24 text-large border-4"
                                    src={user?.avatar.secureUrl ?? `/ava.jpg`}
                                />

                                {isLoading ? (
                                    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-full bg-background/50 backdrop-blur-sm transition-all">
                                        <Spinner color="primary" size="md" />
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                        <Camera className="w-8 h-8 text-white" />
                                    </div>
                                )}

                                <input
                                    ref={fileInputRef}
                                    accept="image/*"
                                    className="hidden"
                                    type="file"
                                    onChange={handleAvatarChange}
                                />
                            </button>
                        </div>
                    </CardHeader>

                    <CardBody className="gap-6 pt-8 px-8 pb-8">
                        <Divider className="bg-divider" />

                        <div className="flex flex-col gap-6">
                            {SETTINGS_FIELDS.map((field) => {
                                const currentValue =
                                    user[field.id as keyof User];

                                return (
                                    <div
                                        key={field.id}
                                        className="flex items-center justify-between group"
                                    >
                                        <div className="flex flex-col gap-1">
                                            <span className="text-content-1 text-xs font-semibold uppercase tracking-wider">
                                                {field.label}
                                            </span>
                                            <span className="text-foreground text-base font-medium">
                                                {(currentValue as string) ||
                                                    "***********"}
                                            </span>
                                        </div>
                                        <Button
                                            className="bg-primary text-white hover:bg-primary/80 font-medium"
                                            size="sm"
                                            onPress={() =>
                                                handleEditClick(field)
                                            }
                                        >
                                            Chỉnh sửa
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    </CardBody>
                </Card>
            </div>

            {editingField && (
                <EditProfileModal
                    currentUser={user}
                    field={editingField}
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                />
            )}
        </DefaultLayout>
    );
}
