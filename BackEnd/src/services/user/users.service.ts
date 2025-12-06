import { UserModel } from "@/models/users.schema";
import { Avatar, User, UserDTO } from "@/types/users.types";
import bcrypt from "bcrypt";
import {
    transformDocument,
    transformDocuments,
} from "@/utils/transformDocument";
import { RegisterDTO } from "@/types/auth.types";
import { ObjectId } from "mongodb";

export const userService = {
    async getAll(): Promise<User[]> {
        return await UserModel.find().lean();
    },

    async getByEmail(email: string): Promise<UserDTO | null> {
        const user = await UserModel.findOne({ email }).lean();
        if (!user) {
            throw new Error("Không tìm thấy người dùng");
        }
        const transformed = transformDocument(user);
        return transformed;
    },

    async getById(id: string): Promise<UserDTO> {
        const user = await UserModel.findById(id).select("-password").lean();
        if (!user) {
            throw new Error("Không tìm thấy người dùng");
        }

        return transformDocument(user);
    },

    async create(userData: RegisterDTO): Promise<RegisterDTO> {
        const existed = await UserModel.findOne({
            email: userData.email,
        }).lean();

        if (existed) {
            throw new Error("Email đã được sử dụng");
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

        const newUser = await UserModel.create({
            email: userData.email,
            name: userData.name,
            password: hashedPassword,
        });

        if (!newUser) {
            throw new Error("Không thể tạo mới người dùng");
        }

        const transformed = transformDocument(newUser.toObject());
        return transformed;
    },

    async update(id: string, data: Partial<User>): Promise<UserDTO | null> {
        const user = await UserModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).lean();

        if (!user) {
            throw new Error("Không thể cập nhật người dùng");
        }
        const transformed = transformDocument(user);
        return transformed;
    },

    async delete(id: string): Promise<boolean> {
        const result = await UserModel.findByIdAndDelete(id);
        return !!result;
    },

    async searchByName(
        query: string,
        currentUserId: string
    ): Promise<UserDTO[] | []> {
        try {
            const result = await UserModel.find({
                _id: { $ne: currentUserId },
                name: { $regex: query, $options: "i" },
            })
                .select("-password")
                .lean();

            const transformed = transformDocuments(result);
            return transformed;
        } catch (error) {
            return [];
        }
    },

    async getUserNameById(id: ObjectId): Promise<string | null> {
        const user = await UserModel.findById(id).select("name").lean();
        return user?.name ?? null;
    },
    async getUserAvaById(id: ObjectId): Promise<Avatar | null> {
        const user = await UserModel.findById(id).select("avatar").lean();
        return user?.avatar ?? null;
    },
    async updateUserProfile(userId: string, payload: Partial<User>) {
        if (payload.password) {
            const saltRounds = 10;
            payload.password = await bcrypt.hash(payload.password, saltRounds);
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $set: payload },
            { new: true, runValidators: true }
        ).lean();

        if (!updatedUser) throw new Error("User not found");

        return transformDocument(updatedUser);
    },
};
