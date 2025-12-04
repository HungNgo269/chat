import { InferSchemaType, model, Schema } from "mongoose";
import { UserRole } from "../types/enum.types";
import { User } from "../types/users.types";

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
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
        name: { type: String, required: true },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.USER,
        },
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

// userSchema.set("toJSON", {
//     virtuals: true,
//     versionKey: false,
//     transform: function (doc, ret: Record<string, any>) {
//         ret.id = ret._id?.toString();
//         delete ret._id;
//         delete ret.__v;
//         delete ret.password;
//         return ret;
//     },
// });

export const UserModel = model<User>("User", userSchema);
