import { AttachmentType } from "./enums";

export interface Attachment {
    type: AttachmentType;
    secure_url: string;
    publicId: string;
    // thumbnailUrl?: string;
    // fileName?: string;
    // fileSize?: number;
    // mimeType?: string;
    width?: number | null;
    height?: number | null;
    // duration?: number;
}
