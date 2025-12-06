import cloudinary from "@/config/cloudinary";
import { UploadImageType } from "@/types/uploadImageType";
import { Readable } from "stream";
import { UserModel } from "@/models/users.schema";
import { getValidObjectId } from "@/utils/checkValidObjectId";
import { ObjectId } from "mongodb";

export const uploadService = {
    async UploadToCloudinary(
        file: Express.Multer.File,
        folderPath: string
    ): Promise<UploadImageType> {
        if (!file) {
            throw new Error("Lỗi khi gửi ảnh lên");
        }
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "auto",
                    folder: folderPath,
                },
                (error, result) => {
                    if (error) return reject(error);
                    if (!result)
                        return reject(new Error("Cloudinary upload failed."));

                    const returnData: UploadImageType = {
                        public_id: result.public_id,
                        secure_url: result.secure_url,
                        height: result.height,
                        width: result.width,
                    };
                    resolve(returnData);
                }
            );
            Readable.from(file.buffer).pipe(uploadStream);
        });
    },

    async UpdateUserAvatar(
        userId: string,
        newImage: { public_id: string; secure_url: string }
    ): Promise<void> {
        const validUserId = getValidObjectId(userId);

        const user = await UserModel.findById(validUserId);
        if (!user) throw new Error("User không tồn tại");

        if (user.avatar?.publicId) {
            try {
                await cloudinary.uploader.destroy(user.avatar.publicId);
            } catch (error) {
            }
        }

        await UserModel.findByIdAndUpdate(validUserId, {
            avatar: {
                secureUrl: newImage.secure_url,
                publicId: newImage.public_id,
            },
        });
    },
};
