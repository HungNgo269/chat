import { configEnv } from "../../config/env";
import { UserModel } from "../../models/users.schema";
import { LoginDTO, RegisterDTO } from "../../types/auth.types";
import { TokenPayload } from "../../types/payload.types";
import { UserDTO } from "../../types/users.types"; // Đảm bảo type này khớp
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { transformDocument } from "../../utils/transformDocument";
import {
    refresh_tokenType,
    RefreshModel,
} from "../../models/refreshToken.schema";

export const authService = {
    async Register(userData: RegisterDTO): Promise<RegisterDTO> {
        const user = await UserModel.findOne({ email: userData.email }).lean();
        if (user) {
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
            throw new Error("Không thể đăng ký người dùng");
        }
        const userObj = newUser.toObject();
        return transformDocument(userObj);
    },

    async Login(
        userData: LoginDTO
    ): Promise<{ user: UserDTO; access_token: string; refresh_token: string }> {
        const user = await UserModel.findOne({ email: userData.email }).lean();
        if (!user) {
            throw new Error("Người dùng không tồn tại");
        }
        const check = await bcrypt.compare(userData.password, user?.password);
        if (!check) {
            throw new Error("Email hoặc mật khẩu không đúng");
        }

        const currentUser: UserDTO = {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: {
                publicId: user.avatar?.publicId ?? null,
                secureUrl: user.avatar?.secureUrl ?? "",
            },
            createdAt: user.createdAt,
        };
        const { access_token, refresh_token } =
            this.GenerateTokens(currentUser);

        const data: refresh_tokenType = {
            token: refresh_token,
            userId: user._id,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        };

        await RefreshModel.create(data);

        return { user: currentUser, access_token, refresh_token };
    },
    async Logout(refresh_token: string) {
        await RefreshModel.deleteOne({ token: refresh_token });
        return true;
    },
    async RefreshAccessToken(refresh_token: string): Promise<string> {
        const payload = this.VerifyRefreshToken(refresh_token);
        if (!payload) throw new Error("refresh_token không hợp lệ");

        const checkDb = await RefreshModel.findOne({
            token: refresh_token,
        }).lean();
        if (!checkDb)
            throw new Error("refresh_token hết hạn hoặc không tồn tại");

        const user = await UserModel.findById(payload.userId)
            .select("-password")
            .lean();
        if (!user) throw new Error("User không tồn tại");

        const userDTO: UserDTO = {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: {
                publicId: user.avatar?.publicId ?? null,
                secureUrl: user.avatar?.secureUrl ?? "",
            },
            createdAt: user.createdAt,
        };

        const newaccess_token = jwt.sign(
            { user: userDTO },
            configEnv.access_secret,
            {
                expiresIn: "15m",
            }
        );
        return newaccess_token;
    },

    GenerateTokens(user: UserDTO) {
        if (!user) {
            throw new Error("Không có dữ liệu người dùng");
        }

        const access_token = jwt.sign(
            {
                user,
            },
            configEnv.access_secret,
            { expiresIn: "15m" }
        );

        const refresh_token = jwt.sign(
            {
                userId: user.id,
                type: "refresh",
            },
            configEnv.refresh_secret,
            { expiresIn: "7d" }
        );
        return { access_token, refresh_token };
    },
    VerifyRefreshToken(token: string): TokenPayload {
        return jwt.verify(token, configEnv.refresh_secret) as TokenPayload;
    },
    VerifyAccessToken(token: string): TokenPayload {
        return jwt.verify(token, configEnv.access_secret) as TokenPayload;
    },
};
