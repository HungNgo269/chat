import { Router } from "express";
import {
    CheckAuth,
    Login,
    Logout,
    Refresh,
    Register,
} from "../controllers/auth/auth.controller";
import { validate } from "../middlewares/validate";
import { registerSchema } from "../schema/auth.schema";

const AuthRouter = Router();
AuthRouter.post("/login", Login);
AuthRouter.post("/register", validate(registerSchema), Register);
AuthRouter.get("/logout", Logout);

AuthRouter.post("/me", CheckAuth);
AuthRouter.post("/refresh", Refresh);

export default AuthRouter;
