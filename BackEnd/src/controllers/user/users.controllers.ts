import { Request, Response } from "express";
import { userService } from "../../services/user/users.service";

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAll();
        return res.json({ success: true, data: users });
    } catch {
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await userService.getById(req.params.id);
        if (!user)
            return res
                .status(404)
                .json({ success: false, message: "Không tìm thấy" });
        return res.json({ success: true, data: user });
    } catch {
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

export const getUserByEmail = async (req: Request, res: Response) => {
    try {
        const user = await userService.getByEmail(req.params.email);
        if (!user)
            return res
                .status(404)
                .json({ success: false, message: "Không tìm thấy" });
        return res.json({ success: true, data: user });
    } catch {
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const newUser = await userService.create(req.body);
        return res.status(201).json({ success: true, data: newUser });
    } catch (err: any) {
        return res.status(400).json({ success: false, message: err.message });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const updated = await userService.update(req.params.id, req.body);
        return res.json({ success: true, data: updated });
    } catch (err: any) {
        return res.status(400).json({ success: false, message: err.message });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        await userService.delete(req.params.id);
        return res.status(200).json({ success: true, data: null });
    } catch {
        return res
            .status(500)
            .json({ success: false, message: "Không thể xóa" });
    }
};

export const searchUser = async (req: Request, res: Response) => {
    const { query } = req.query;
    const userId = req.user!.userId;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "Id người dùng không tồn tại",
        });
    }
    try {
        const data = await userService.searchByName(query as string, userId);
        return res.json({ success: true, data });
    } catch {
        return res
            .status(400)
            .json({ success: false, message: "Tìm kiếm lỗi" });
    }
};
export const updateProfile = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        return res
            .status(401)
            .json({ success: false, message: "Không có quyền" });
    }
    try {
        console.log("check body", req.body);
        if (req.body === "avatar") {
        }
        const result = await userService.updateUserProfile(userId, req.body);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res
            .status(400)
            .json({ success: false, message: "Server đang bị lỗi" });
    }
};
