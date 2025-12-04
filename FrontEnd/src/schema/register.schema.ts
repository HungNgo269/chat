import { z } from "zod";

export const registerSchema = z.object({
  email: z.email("Email không hợp lệ").min(2, "Email phải có ít nhất 2 kí tự "),
  name: z
    .string("Không được để trống")
    .min(2, "Tên người dùng phải có ít nhất 2 ký tự")
    .max(50, "Tên người dùng không được quá 50 ký tự")
    .trim(),
  password: z
    .string("Không được để trống")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
});
export type RegisterInput = z.infer<typeof registerSchema>;
