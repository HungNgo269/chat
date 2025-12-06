import { Router } from "express";
import {
    getMessages,
    sendMessage,
} from "@/controllers/message/messsages.controllers";
import { validate } from "@/middlewares/validate";
import { sendMessageSchema } from "@/schema/message.schema";
import { authMiddleware } from "@/middlewares/auth.middleware";

const MessageRouter = Router();
MessageRouter.use(authMiddleware);

MessageRouter.post("/", getMessages);
MessageRouter.post("/send", validate(sendMessageSchema), sendMessage);
export default MessageRouter;
