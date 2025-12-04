import { ObjectId } from "mongodb";
import { Types } from "mongoose";
import {
    FriendDTO,
    FriendList,
    FriendRequestResponse,
} from "../../types/friend.types";
import { FriendModel } from "../../models/friends.schema";
import { DbFriendStatus, UserRelationStatus } from "../../types/enum.types";
import {
    transformDocument,
    transformDocuments,
} from "../../utils/transformDocument";
import { User, UserAvatarDTO } from "../../types/users.types";

export const FriendService = {
    async sendFriendRequest(
        userId: ObjectId,
        friendId: ObjectId
    ): Promise<FriendDTO> {
        if (userId.equals(friendId)) {
            throw new Error("Không thể tự kết bạn với chính mình");
        }

        const existingFriendship = await FriendModel.findOne({
            $or: [
                { requester: userId, recipient: friendId },
                { requester: friendId, recipient: userId },
            ],
        });

        if (existingFriendship) {
            if (existingFriendship.status === DbFriendStatus.ACCEPTED) {
                throw new Error("Hai người đã là bạn bè");
            }
            if (existingFriendship.status === DbFriendStatus.PENDING) {
                const isRequester =
                    existingFriendship.requester.toString() ===
                    userId.toString();
                if (isRequester) {
                    throw new Error("Bạn đã gửi lời mời rồi");
                } else {
                    throw new Error(
                        "Bạn đã nhận được lời mời kết bạn từ người này, hãy chấp nhận nó"
                    );
                }
            }
        }

        const newFriendship = await FriendModel.create({
            requester: userId,
            recipient: friendId,
            status: DbFriendStatus.PENDING,
        });
        return transformDocument(newFriendship.toObject());
    },

    async getFriendStatus(
        userId: ObjectId,
        friendId: ObjectId
    ): Promise<UserRelationStatus> {
        const relationship = await FriendModel.findOne({
            $or: [
                { requester: userId, recipient: friendId },
                { requester: friendId, recipient: userId },
            ],
        }).lean();

        if (!relationship) {
            return UserRelationStatus.NOT_FRIEND;
        }

        if (relationship.status === DbFriendStatus.ACCEPTED) {
            return UserRelationStatus.FRIEND;
        }

        if (relationship.status === DbFriendStatus.PENDING) {
            const isRequester =
                relationship.requester.toString() === userId.toString();
            return isRequester
                ? UserRelationStatus.SENT
                : UserRelationStatus.RECEIVED;
        }

        return UserRelationStatus.NOT_FRIEND;
    },

    async acceptFriendRequest(
        userId: ObjectId,
        requesterId: ObjectId
    ): Promise<FriendDTO> {
        const friendship = await FriendModel.findOne({
            requester: requesterId,
            recipient: userId,
            status: DbFriendStatus.PENDING,
        }).lean();
        const friendship2 = await FriendModel.findOne({
            requester: requesterId,
            recipient: userId,
        }).lean();
        const friendship3 = await FriendModel.findOne({
            requester: userId,
            recipient: requesterId,
        }).lean();
        console.log("friendship", friendship);
        console.log("friendship2", friendship2);
        console.log("friendship3", friendship3);

        if (!friendship) {
            throw new Error("Lời mời kết bạn không tồn tại hoặc đã bị hủy");
        }

        const updatedFriendship = await FriendModel.findByIdAndUpdate(
            friendship._id,
            { status: DbFriendStatus.ACCEPTED },
            { new: true }
        ).lean();
        console.log("updatedFriendship", updatedFriendship);
        if (!updatedFriendship) throw new Error("Lỗi cập nhật trạng thái");

        return transformDocument(updatedFriendship);
    },

    async cancelFriendRequest(
        userId: ObjectId,
        recipientId: ObjectId
    ): Promise<FriendDTO> {
        const friendship = await FriendModel.findOneAndDelete({
            requester: userId,
            recipient: recipientId,
            status: DbFriendStatus.PENDING,
        }).lean();

        if (!friendship) {
            throw new Error("Lời mời không tồn tại để hủy");
        }

        return transformDocument(friendship);
    },

    async rejectFriendRequest(
        userId: ObjectId,
        requesterId: ObjectId
    ): Promise<FriendDTO> {
        const friendship = await FriendModel.findOneAndDelete({
            requester: requesterId,
            recipient: userId,
            status: DbFriendStatus.PENDING,
        }).lean();

        if (!friendship) {
            throw new Error("Lời mời không tồn tại để từ chối");
        }

        return transformDocument(friendship);
    },

    async unfriend(userId: ObjectId, friendId: ObjectId): Promise<FriendDTO> {
        const friendship = await FriendModel.findOneAndDelete({
            $or: [
                { requester: userId, recipient: friendId },
                { requester: friendId, recipient: userId },
            ],
            status: DbFriendStatus.ACCEPTED,
        }).lean();

        if (!friendship) {
            throw new Error("Hai người chưa phải là bạn bè");
        }

        return transformDocument(friendship);
    },

    async getFriendList(userId: ObjectId): Promise<UserAvatarDTO[]> {
        const friends = await FriendModel.find({
            $or: [{ requester: userId }, { recipient: userId }],
            status: DbFriendStatus.ACCEPTED,
        })
            .populate<{ requester: User }>("requester", "name avatar")
            .populate<{ recipient: User }>("recipient", "name avatar")
            .lean<FriendList[]>();

        const friendAvatarList: UserAvatarDTO[] = friends.map((f) => {
            const isRequester =
                f.requester._id?.toString() === userId.toString();
            const friendData = isRequester ? f.recipient : f.requester;

            return {
                id: friendData._id?.toString() || "",
                name: friendData.name,
                avatar: friendData.avatar,
            };
        });

        return friendAvatarList;
    },

    async getFriendRequests(
        userId: ObjectId
    ): Promise<FriendRequestResponse[] | null> {
        const friendRequests = await FriendModel.find({
            recipient: userId,
            status: DbFriendStatus.PENDING,
        })
            .populate({
                path: "requester",
                select: " name avatar",
            })
            .lean<FriendRequestResponse[]>();
        console.log("chec1", friendRequests);

        console.log("chec", transformDocuments(friendRequests));
        return transformDocuments(friendRequests);
    },
};
