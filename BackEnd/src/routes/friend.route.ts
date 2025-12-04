import { Router } from "express";
import {
    acceptFriendRequest,
    cancelFriendRequest,
    getUserRelationStatus,
    getFriendList,
    getFriendRequests,
    rejectFriendRequest,
    sendFriendRequest,
    unfriend,
} from "../controllers/friend/friends.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const FriendRouter = Router();

FriendRouter.use(authMiddleware);

FriendRouter.get("/list", getFriendList);
FriendRouter.get("/requests", getFriendRequests);
FriendRouter.get("/status/:friendId", getUserRelationStatus);

FriendRouter.post("/send", sendFriendRequest);
FriendRouter.patch("/accept", acceptFriendRequest);

FriendRouter.delete("/cancel/:friendId", cancelFriendRequest);
FriendRouter.delete("/reject/:friendId", rejectFriendRequest);
FriendRouter.delete("/:friendId", unfriend);

export default FriendRouter;
