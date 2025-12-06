import { Request, Response } from "express";
import { FriendService } from "@/services/friend/friend.service";
import { getValidObjectId } from "@/utils/checkValidObjectId";

export const sendFriendRequest = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { friendId } = req.body;

    if (!userId || !friendId) {
        return res
            .status(400)
            .json({ success: false, message: "Lỗi tham số: Thiếu friendId" });
    }

    const senderObjId = getValidObjectId(userId);
    const receiverObjId = getValidObjectId(friendId);

    if (!senderObjId || !receiverObjId) {
        return res
            .status(400)
            .json({ success: false, message: "ID không hợp lệ" });
    }

    try {
        const data = await FriendService.sendFriendRequest(
            senderObjId,
            receiverObjId
        );
        return res.status(201).json({ success: true, data });
    } catch (err: any) {
        return res.status(400).json({ success: false, message: err.message });
    }
};
export const getUserRelationStatus = async (req: Request, res: Response) => {
    const { friendId } = req.params;
    const userId = req.user?.userId;

    if (!userId || !friendId) {
        return res.status(400).json({ success: false, message: "Lỗi tham số" });
    }

    const userObjId = getValidObjectId(userId);
    const friendObjId = getValidObjectId(friendId);

    if (!userObjId || !friendObjId) {
        return res
            .status(400)
            .json({ success: false, message: "ID không hợp lệ" });
    }

    try {
        const data = await FriendService.getFriendStatus(
            userObjId,
            friendObjId
        );
        return res.json({ success: true, data });
    } catch (err: any) {
        return res.status(400).json({ success: false, message: err.message });
    }
};
export const acceptFriendRequest = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { friendId } = req.body;
    if (!userId || !friendId) {
        return res.status(400).json({ success: false, message: "Lỗi tham số" });
    }

    const userObjId = getValidObjectId(userId);
    const friendObjId = getValidObjectId(friendId);

    if (!userObjId || !friendObjId) {
        return res
            .status(400)
            .json({ success: false, message: "ID không hợp lệ" });
    }

    try {
        const data = await FriendService.acceptFriendRequest(
            userObjId,
            friendObjId
        );
        return res.json({ success: true, data });
    } catch (err: any) {
        return res.status(400).json({ success: false, message: err.message });
    }
};

export const cancelFriendRequest = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { friendId } = req.params;

    if (!userId || !friendId)
        return res.status(400).json({ success: false, message: "Thiếu ID" });

    const userObjId = getValidObjectId(userId);
    const friendObjId = getValidObjectId(friendId);

    if (!userObjId || !friendObjId)
        return res
            .status(400)
            .json({ success: false, message: "ID sai format" });

    try {
        const result = await FriendService.cancelFriendRequest(
            userObjId,
            friendObjId
        );
        return res.json({ success: true, data: result });
    } catch (err: any) {
        return res.status(400).json({ success: false, message: err.message });
    }
};

export const rejectFriendRequest = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { friendId } = req.params;

    if (!userId || !friendId)
        return res.status(400).json({ success: false, message: "Thiếu ID" });

    const userObjId = getValidObjectId(userId);
    const friendObjId = getValidObjectId(friendId);

    if (!userObjId || !friendObjId)
        return res
            .status(400)
            .json({ success: false, message: "ID sai format" });

    try {
        const result = await FriendService.rejectFriendRequest(
            userObjId,
            friendObjId
        );
        return res.json({ success: true, data: result });
    } catch (err: any) {
        return res.status(400).json({ success: false, message: err.message });
    }
};

export const unfriend = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { friendId } = req.params;

    if (!userId || !friendId)
        return res.status(400).json({ success: false, message: "Thiếu ID" });

    const userObjId = getValidObjectId(userId);
    const friendObjId = getValidObjectId(friendId);

    if (!userObjId || !friendObjId)
        return res
            .status(400)
            .json({ success: false, message: "ID sai format" });

    try {
        await FriendService.unfriend(userObjId, friendObjId);
        return res
            .status(200)
            .json({
                success: true,
                message: "Đã hủy kết bạn thành công",
                data: null,
            });
    } catch (err: any) {
        return res.status(400).json({ success: false, message: err.message });
    }
};

export const getFriendList = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId)
        return res
            .status(400)
            .json({ success: false, message: "Lỗi xác thực" });

    const userObjId = getValidObjectId(userId);
    if (!userObjId)
        return res.status(400).json({ success: false, message: "ID User lỗi" });

    try {
        const data = await FriendService.getFriendList(userObjId);
        return res.status(200).json({ success: true, data });
    } catch (err: any) {
        return res.status(400).json({ success: false, message: err.message });
    }
};

export const getFriendRequests = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId)
        return res
            .status(400)
            .json({ success: false, message: "Lỗi xác thực" });

    const userObjId = getValidObjectId(userId);
    if (!userObjId)
        return res.status(400).json({ success: false, message: "ID User lỗi" });

    try {
        const data = await FriendService.getFriendRequests(userObjId);
        return res.status(200).json({ success: true, data });
    } catch (err: any) {
        return res.status(400).json({ success: false, message: err.message });
    }
};
