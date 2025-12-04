import { InferSchemaType, model, Schema } from "mongoose";
import { attachmentSchema } from "./attachments.schema";

const MessageSchema = new Schema(
    {
        conversationId: {
            type: Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
        },
        text: { type: String, default: null },
        senderId: { type: Schema.Types.ObjectId },
        receiverId: { type: Schema.Types.ObjectId },
        attachments: { type: attachmentSchema, default: null },
    },
    { timestamps: true }
);

type Message = InferSchemaType<typeof MessageSchema>;

export const MessageModel = model<Message>("Message", MessageSchema);
