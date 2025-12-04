import { JwtPayload } from "jsonwebtoken";
import { UserRole } from "./enum.types";
import { Avatar } from "./users.types";

export interface TokenPayload extends JwtPayload {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar: Avatar;
}
