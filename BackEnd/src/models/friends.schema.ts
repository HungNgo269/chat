import { InferSchemaType, model, Schema, Types } from "mongoose";
import { DbFriendStatus, UserRelationStatus } from "../types/enum.types";

const FriendSchema = new Schema(
    {
        requester: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        recipient: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(DbFriendStatus),
            default: DbFriendStatus.PENDING,
        },
    },
    { timestamps: true }
);

// Đảm bảo A không thể gửi 2 lời mời cho B cùng lúc
FriendSchema.index({ requester: 1, recipient: 1 }, { unique: true });

type Friend = InferSchemaType<typeof FriendSchema>;

export const FriendModel = model<Friend>("Friend", FriendSchema);
