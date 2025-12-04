import { Router } from "express";
import {
    createUser,
    deleteUser,
    getUserById,
    searchUser,
    updateProfile,
    updateUser,
} from "../controllers/user/users.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";

const UserRouter = Router();
UserRouter.use(authMiddleware);
UserRouter.get("/search", searchUser);
UserRouter.patch("/profile", updateProfile);

UserRouter.get("/:id", getUserById);
UserRouter.post("/", createUser);
UserRouter.patch("/:id", updateUser);
UserRouter.delete("/:id", deleteUser);
export default UserRouter;
