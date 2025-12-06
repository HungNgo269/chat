import { Schema } from "mongoose";
import { AttachmentType } from "@/types/enum.types";

export const attachmentSchema = new Schema(
    {
        type: {
            type: String,
            enum: Object.values(AttachmentType),
            required: true,
        },
        secure_url: { type: String, required: true },
        publicId: { type: String, required: true },
        // thumbnailUrl: { type: String },
        // fileName: { type: String },
        // fileSize: { type: String },
        // mimeType: { type: String },
        width: { type: Number },
        height: { type: Number },
        // duration: { type: String },
    },
    { _id: false }
);
