import { Schema, InferSchemaType, model } from "mongoose";

const refresh_tokenSchema = new Schema({
    token: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
});

refresh_tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); //hết hạn thì xóa

export type refresh_tokenType = InferSchemaType<typeof refresh_tokenSchema>;
export const RefreshModel = model<refresh_tokenType>(
    "Token",
    refresh_tokenSchema
);
