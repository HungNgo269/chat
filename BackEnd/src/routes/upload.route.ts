import { Router } from "express";
import upload from "../middlewares/multer.middleware";
import { handleUploadImage } from "../controllers/upload/upload.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";

const UploadRouter = Router();
UploadRouter.use(authMiddleware);

UploadRouter.post(
    "/image/message",
    upload.single("MessageImage"),
    handleUploadImage
);

UploadRouter.patch(
    "/image/avatar",
    upload.single("AvatarImage"),
    handleUploadImage
);

export default UploadRouter;
