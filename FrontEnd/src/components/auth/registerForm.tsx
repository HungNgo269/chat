import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Divider } from "@heroui/divider";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

import { UseRegister } from "@/hooks/api/useAuth";
import { RegisterInput, registerSchema } from "@/schema/register.schema";

export const RegisterForm = () => {
    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        mode: "onBlur",
    });

    const navigate = useNavigate();
    const { mutate, isPending } = UseRegister();

    const onSubmit: SubmitHandler<RegisterInput> = async (data) => {
        mutate(data, {
            onSuccess: () => {
                toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
                navigate("/login", { replace: true });
            },
            onError: (error: any) => {
                const serverErrors = error.response?.data?.errors;

                if (serverErrors && Array.isArray(serverErrors)) {
                    serverErrors.forEach(
                        (err: { path: string; message: string }) => {
                            setError(err.path as keyof RegisterInput, {
                                type: "server",
                                message: err.message,
                            });
                        },
                    );
                } else {
                    toast.error(
                        error.response?.data?.message || "Đăng ký thất bại",
                    );
                }
            },
        });
    };

    return (
        <Card className="w-[400px] p-4 shadow-lg">
            <CardHeader className="flex gap-3 flex-col items-center justify-center pb-6">
                <h1 className="font-bold text-2xl text-foreground">
                    Tạo tài khoản mới
                </h1>
                <p className="text-small text-default-500">
                    Nhập thông tin của bạn để bắt đầu
                </p>
            </CardHeader>

            <CardBody>
                <form
                    className="flex flex-col gap-6"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Controller
                        control={control}
                        name="name"
                        render={({ field }) => (
                            <Input
                                {...field}
                                errorMessage={errors.name?.message}
                                isInvalid={!!errors.name}
                                label="Tên hiển thị"
                                variant="bordered"
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="email"
                        render={({ field }) => (
                            <Input
                                {...field}
                                errorMessage={errors.email?.message}
                                isInvalid={!!errors.email}
                                label="Email"
                                variant="bordered"
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="password"
                        render={({ field }) => (
                            <Input
                                {...field}
                                errorMessage={errors.password?.message}
                                isInvalid={!!errors.password}
                                label="Mật khẩu"
                                type={"password"}
                                variant="bordered"
                            />
                        )}
                    />

                    <Button
                        className="w-full font-semibold shadow-md"
                        color="primary"
                        isLoading={isPending}
                        size="lg"
                        type="submit"
                    >
                        {isPending ? "Đang xử lý..." : "Đăng ký tài khoản"}
                    </Button>
                </form>
            </CardBody>

            <CardFooter className="flex flex-col gap-2 justify-center pt-4">
                <Divider className="my-2" />
                <div className="flex flex-row text-sm gap-1">
                    <span className="text-default-500">Đã có tài khoản?</span>
                    <Link
                        className="text-primary hover:underline font-medium"
                        to="/login"
                    >
                        Đăng nhập ngay
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
};
