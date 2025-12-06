import { Request, Response, NextFunction } from "express";
import { authService } from "@/services/auth/auth.service";
import { Avatar } from "@/types/users.types";

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                email: string;
                avatar: Avatar;
                name: string;
                role: string;
            };
        }
    }
}

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Token không được cung cấp",
            });
        }
        const access_token = authHeader.split(" ")[1]; // Lấy token sau "Bearer "

        const payload = authService.VerifyAccessToken(access_token);
        req.user = {
            userId: payload.user.id,
            avatar: payload.user.avatar,
            email: payload.user.email,
            name: payload.user.name,
            role: payload.user.role,
        };

        next();
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Token đã hết hạn",
                code: "TOKEN_EXPIRED",
            });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                message: "Token không hợp lệ",
                code: "TOKEN_INVALID",
            });
        }
        return res.status(401).json({
            message: "Xác thực thất bại",
        });
    }
};
