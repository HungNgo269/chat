import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Divider } from "@heroui/divider";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

import { UseLogin } from "@/hooks/api/useAuth";

interface Inputs {
    email: string;
    password: string;
}

export const LoginForm = () => {
    const { control, handleSubmit } = useForm<Inputs>();
    const navigate = useNavigate();
    const { mutate, isPending, isError } = UseLogin();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        mutate(data, {
            onSuccess: () => {
                toast.success("Đăng nhập thành công!");
                navigate("/", { replace: true });
            },
            onError: () => {},
        });
    };

    return (
        <Card className="w-[400px] p-4 shadow-lg">
            <CardHeader className="flex gap-3 flex-col items-center justify-center pb-6">
                <h1 className="font-bold text-2xl text-foreground">
                    Chào mừng trở lại
                </h1>
                <p className="text-small text-default-500">
                    Đăng nhập để tiếp tục trải nghiệm
                </p>
            </CardHeader>

            <CardBody>
                <form
                    className="flex flex-col gap-6"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Controller
                        control={control}
                        name="email"
                        render={({ field, fieldState }) => (
                            <Input
                                {...field}
                                isInvalid={fieldState.invalid}
                                label="Email"
                                variant="bordered"
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="password"
                        render={({ field, fieldState }) => (
                            <Input
                                {...field}
                                isInvalid={fieldState.invalid}
                                label="Mật khẩu"
                                type={"password"}
                                variant="bordered"
                            />
                        )}
                    />

                    {isError && (
                        <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-danger" />
                            <p className="text-danger text-sm font-medium">
                                Email hoặc mật khẩu không chính xác
                            </p>
                        </div>
                    )}

                    <Button
                        className="w-full font-semibold shadow-md"
                        color="primary"
                        isLoading={isPending}
                        size="lg"
                        type="submit"
                    >
                        {isPending ? "Đang xử lý..." : "Đăng nhập"}
                    </Button>
                </form>
            </CardBody>

            <CardFooter className="flex flex-col gap-2 justify-center pt-4">
                <Divider className="my-2" />
                <div className="flex flex-row text-sm gap-1">
                    <span className="text-default-500">Chưa có tài khoản?</span>
                    <Link
                        className="text-primary hover:underline font-medium"
                        to="/register"
                    >
                        Đăng ký ngay
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
};
