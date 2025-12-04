import { UserRelationStatus, UserRole } from "./enums";

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar: Avatar;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface UpdateProfileData {
    name?: string;
    email?: string;
    password?: string;
}

export interface Avatar {
    secureUrl: string;
    publicId: string | null;
}
export interface UserAvatar {
    id: string;
    name: string;
    avatar: Avatar;
}
export interface friendRequest {
    id: string;
    recipient: string;
    requester: UserAvatar;
    status: UserRelationStatus;
    createdAt?: Date;
    updatedAt?: Date;
}
