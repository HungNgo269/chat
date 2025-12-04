import { InferSchemaType, model, Schema, Types } from "mongoose";
import { Conversation } from "../types/conversations.types";

const ConversationSchema = new Schema(
    {
        participants: {
            type: [Schema.Types.ObjectId],
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            default: null,
        },
        isGroup: {
            type: Boolean,
            default: false,
        },
        avatar: {
            secureUrl: {
                type: String,
                default:
                    "https://res.cloudinary.com/dm3j1fqob/image/upload/v1763449144/chatApp/690d921f927a0e84b971bc28/pimzcmfskilywo5om0pj.jpg",
            },
            publicId: {
                type: String,
                default: null, //null=  dùng ảnh mặc định
            },
        },
        lastMessage: {
            type: String,
            default: null,
        },
        lastMessageAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

// type Conversation = InferSchemaType<typeof ConversationSchema>;

export const ConversationModel = model<Conversation>(
    "Conversation",
    ConversationSchema
);
