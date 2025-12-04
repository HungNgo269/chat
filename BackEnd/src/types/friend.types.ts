import { ObjectId } from "mongodb";
import { DbFriendStatus } from "./enum.types";
import { User, UserAvatarDTO } from "./users.types";

export interface Friend {
    _id: ObjectId;
    requester: ObjectId;
    recipient: ObjectId;
    status: DbFriendStatus;
}
export interface FriendList {
    id: ObjectId;
    requester: User;
    recipient: User;
    status: DbFriendStatus;
}
export interface FriendRequestResponse {
    id: string;
    requester?: UserAvatarDTO;
}

export type FriendDTO = Omit<Friend, "_id" | "__v"> & {
    id: string;
};
