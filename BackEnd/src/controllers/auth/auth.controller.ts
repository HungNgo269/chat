import { Request, Response } from "express";
import { authService } from "../../services/auth/auth.service";
import { configEnv } from "../../config/env";
import { RegisterInput } from "../../schema/auth.schema";
import { userService } from "../../services/user/users.service";
import { UserDTO } from "../../types/users.types";

export const Register = async (req: Request, res: Response) => {
    const { email, name, password } = req.body as RegisterInput;

    try {
        const user = await authService.Register({
            email,
            name,
            password,
        });
        return res.status(200).json({
            success: true,
            message: " Đăng ký thành công",
            data: user,
        });
    } catch (error: unknown) {
        const err = error as Error;
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
export const Login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const { user, access_token, refresh_token } = await authService.Login({
            email,
            password,
        });

        res.cookie("refresh_token", refresh_token, {
            httpOnly: true,
            sameSite: "strict",
            secure: configEnv.node_env === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({
            success: true,
            message: "Đăng nhập thành công",
            data: {
                user,
                access_token,
            },
        });
    } catch (error: unknown) {
        const err = error as Error;
        return res.status(401).json({
            success: false,
            message: err.message,
        });
    }
};
export const Logout = async (req: Request, res: Response) => {
    try {
        const refresh_token = req.cookies.refresh_token;
        if (!refresh_token) {
            return res.status(200).json({
                success: true,
                message: "Đã đăng xuất",
                data: null,
            });
        }

        await authService.Logout(refresh_token);
        res.clearCookie("refresh_token", {
            httpOnly: true,
            sameSite: "strict",
            secure: configEnv.node_env === "production",
        });
        return res.status(200).json({
            success: true,
            message: "Đăng xuất thành công",
            data: null,
        });
    } catch (error: unknown) {
        const err = error as Error;
        console.log("err", err);
        return res.status(401).json({
            success: false,
            message: err.message,
        });
    }
};
export const Refresh = async (req: Request, res: Response) => {
    try {
        const refresh_token =
            req.cookies.refresh_token || req.body.refresh_token;
        if (!refresh_token) {
            return res.status(401).json({
                success: false,
                message: "Bạn đã đăng xuất, vui lòng đăng nhập lại",
            });
        }
        const newAccessToken = await authService.RefreshAccessToken(
            refresh_token
        );

        return res.status(200).json({
            success: true,
            data: newAccessToken,
        });
    } catch (error: unknown) {
        const err = error as Error;
        return res.status(401).json({
            success: false,
            message: err.message,
        });
    }
};
export const CheckAuth = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Token không được cung cấp",
            });
        }
        const access_token = authHeader.split(" ")[1]; // Lấy token sau "Bearer "
        if (!access_token) {
            return res.status(401).json({
                success: false,
                message: "auth thất bại",
            });
        }
        const data = authService.VerifyAccessToken(access_token);
        return res.status(200).json({
            success: true,
            data,
        });
    } catch (error: unknown) {
        const err = error as Error;
        return res.status(401).json({
            success: false,
            message: err.message,
        });
    }
};
