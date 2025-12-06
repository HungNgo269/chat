import { Request, Response, NextFunction } from "express";
import { uploadService } from "@/services/upload/upload.service";

export const handleUploadImage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.userId;
        if (!req.file) {
            return res.status(400).json({ success: false, message: "File trống!" });
        }

        if (!userId) {
            return res.status(401).json({success:false, message: "Unauthorized" });
        }

        const folderPath = `chatApp/avatars/${userId}`;
        const result = await uploadService.UploadToCloudinary(
            req.file,
            folderPath
        );

        await uploadService.UpdateUserAvatar(userId, {
            public_id: result.public_id,
            secure_url: result.secure_url,
        });

        return res.status(200).json({
            success: true,
            message: "Cập nhật avatar thành công",
            data: {
                secure_url: result.secure_url,
                public_id: result.public_id,
            },
        });
    } catch (error) {
        next(error);
    }
};
