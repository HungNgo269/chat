import { z } from "zod";
import { AttachmentType } from "../types/enum.types";
import { zodObjectId } from "../utils/zodObjectId";

const attachmentSchema = z.object({
    secure_url: z.string().min(1),
    type: z.enum(AttachmentType, {
        message: "Ảnh có kích thước lớn hơn 5mb",
    }),
    publicId: z.string().min(1),
});
export const sendMessageSchema = z
    .object({
        senderId: zodObjectId,
        conversationId: zodObjectId,
        receiverId: z.string().optional(),
        text: z.string().optional(),
        attachments: z.array(attachmentSchema).optional().nullable(), // có thể là mảng, undefined, hoặc null
    })
    // Đảm bảo rằng tin nhắn không thể rỗng (phải có text hoặc attachments)
    .refine(
        (data) => {
            const hasText = data.text && data.text.trim().length > 0;
            const hasAttachments =
                data.attachments && data.attachments.length > 0;
            return hasText || hasAttachments;
        },
        {
            message: "Tin nhắn phải có nội dung văn bản hoặc tệp đính kèm",
            path: ["text", "attachments"],
        }
    );
