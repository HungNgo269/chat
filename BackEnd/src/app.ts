import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import errorMiddleware from "./middlewares/error.middleware";
import UserRouter from "./routes/user.route";
import AuthRouter from "./routes/auth.route";
import ConversationRouter from "./routes/conversation.route";
import { configEnv } from "./config/env";
import cookieParser from "cookie-parser";
import MessageRouter from "./routes/message.route";
import UploadRouter from "./routes/upload.route";
import FriendRouter from "./routes/friend.route";

const app = express();
app.use(helmet()); // bảo mật = cách set express http header
app.use(cookieParser());
app.use(
    cors({
        origin: configEnv.frontEnd_Url,
        credentials: true,
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
