import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import errorMiddleware from "@/middlewares/error.middleware";
import UserRouter from "@/routes/user.route";
import AuthRouter from "@/routes/auth.route";
import ConversationRouter from "@/routes/conversation.route";
import { configEnv } from "@/config/env";
import cookieParser from "cookie-parser";
import MessageRouter from "@/routes/message.route";
import UploadRouter from "@/routes/upload.route";
import FriendRouter from "@/routes/friend.route";

const app = express();
app.use(helmet()); // bảo mật = cách set express http header
app.use(cookieParser());
const allowedOrigins = [
    "http://localhost",
    "http://localhost:3000",
    "https://doamin.com", // Production domain
    "https://www.doamin.com", // Production with www
];
app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (mobile apps, Postman, curl)
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); //ghi log
app.use("/api/users", UserRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/message", MessageRouter);
app.use("/api/conversation", ConversationRouter);
app.use("/api/friend", FriendRouter);
app.use("/api/upload", UploadRouter);
app.use(errorMiddleware);

export default app;
