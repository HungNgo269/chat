import { useForm, Controller } from "react-hook-form";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import toast from "react-hot-toast";

import { UseChangeUserProfile } from "@/hooks/api/useUsers";
import { User } from "@/interfaces/user";

export type FieldType = {
    id: keyof User;
    label: string;
    type: string;
    description?: string;
};

interface EditProfileModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    field: FieldType;
    currentUser: any;
}

export const EditProfileModal = ({
    isOpen,
    onOpenChange,
    field,
    currentUser,
}: EditProfileModalProps) => {
    const { mutate, isPending } = UseChangeUserProfile();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            [field.id]: currentUser[field.id] || "",
        },
    });

    const onSubmit = (data: any) => {
        mutate(data, {
            onSuccess: () => {
                toast.success("Cập nhật thành công!");
            },
            onError: (err) => {
                console.error(err);
            },
        });
    };

    return (
        <Modal
            backdrop="blur"
            className="bg-background border border-divider/80"
            isOpen={isOpen}
            placement="center"
            onOpenChange={onOpenChange}
        >
            <ModalContent>
                {(onClose) => (
                    <form
                        onSubmit={handleSubmit((data) => {
                            onSubmit(data);
                            reset();
                            onClose();
                        })}
                    >
                        <ModalHeader className="flex flex-col gap-1 text-foreground">
                            Thay đổi {field.label}
                        </ModalHeader>

                        <ModalBody>
                            <p className="text-sm text-content-1 mb-2 ">
                                {field.description}
                            </p>

                            <Controller
                                control={control}
                                name={field.id}
                                render={({ field: inputProps }) => (
                                    <Input
                                        {...inputProps}
                                        classNames={{
                                            inputWrapper:
                                                "border-primary/50 focus:border-primary/80 bg-background/10 border-1",
                                            label: "text-foreground",
                                            input: "text-foreground",
                                        }}
                                        errorMessage={
                                            errors[field.id]?.message as string
                                        }
                                        isInvalid={!!errors[field.id]}
                                        label={field.label}
                                        placeholder={`Nhập ${field.label.toLowerCase()} mới`}
                                        type={field.type}
                                        variant="bordered"
                                    />
                                )}
                                rules={{
                                    required: "Trường này không được để trống",
                                }}
                            />
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={onClose}
                            >
                                Hủy bỏ
                            </Button>
                            <Button
                                className="bg-primary font-medium"
                                color="primary"
                                isLoading={isPending}
                                type="submit"
                            >
                                Xác nhận
                            </Button>
                        </ModalFooter>
                    </form>
                )}
            </ModalContent>
        </Modal>
    );
};
