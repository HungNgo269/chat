import { Request, Response, NextFunction } from "express";
import AppError from "@/utils/appError";

const errorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (err.name === "CastError") err = new AppError("ID không hợp lệ", 400);
    if (err.code === 11000)
        err = new AppError("Dữ liệu bị trùng lặp (Duplicate key)", 400);
    if (err.name === "JsonWebTokenError")
        err = new AppError("Token không hợp lệ", 401);
    if (err.name === "TokenExpiredError")
        err = new AppError("Token đã hết hạn", 401);

    return res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};

export default errorMiddleware;
