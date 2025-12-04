import { ObjectId } from "mongodb";
import { UserRole } from "./enum.types";

export interface Avatar {
    secureUrl: string;
    publicId: string | null;
}

// export interface Participants {
//     _id: ObjectId;
//     name: string;
//     avatar: Avatar;
// }
export interface User {
    _id?: ObjectId;
    name: string;
    email: string;
    avatar: Avatar;
    password: string;
    role: UserRole;
    createdAt?: Date;
    updatedAt?: Date;
}

export type UserDTO = Omit<User, "_id" | "password"> & { id: string };
export type UserAvatarDTO = Pick<UserDTO, "id" | "name" | "avatar">;
