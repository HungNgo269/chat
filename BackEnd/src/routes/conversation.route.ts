import { Router } from "express";
import {
    addUserToConversation,
    createConversation,
    getConversation,
    getConversationParticipants,
    getOrCreateConversation,
    getRecentConversation,
    searchConversation,
} from "../controllers/conversation/conversations.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";

const ConversationRouter = Router();
ConversationRouter.use(authMiddleware);
ConversationRouter.post("/get", getConversation);
ConversationRouter.post("/get-or-create", getOrCreateConversation);
ConversationRouter.post("/create", createConversation);

ConversationRouter.post("/:conversationId/add", addUserToConversation);
ConversationRouter.get("/get-recent", getRecentConversation);
ConversationRouter.post("/get-participants", getConversationParticipants);

ConversationRouter.get("/search", searchConversation);

export default ConversationRouter;
