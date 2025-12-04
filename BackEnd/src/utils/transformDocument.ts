import { Types } from "mongoose";
/**
 * Transform Mongoose lean object to clean API response (Recursive)
 * - Removes _id, __v
 * - Converts _id -> id (string)
 * - Handles nested objects and arrays
 */
export const transformDocument = <T>(doc: T): any => {
    // 1. Kiểm tra null hoặc không phải object
    if (!doc || typeof doc !== "object") {
        return doc;
    }

    // 2. Nếu là Date thì giữ nguyên, không transform
    if (doc instanceof Date) {
        return doc;
    }

    // 3. Nếu là Array thì map qua từng phần tử
    if (Array.isArray(doc)) {
        return doc.map((item) => transformDocument(item)) as any;
    }

    // 4. Nếu là ObjectId (độc lập) thì convert sang string
    if (
        Types.ObjectId.isValid(doc as any) &&
        (doc as any) instanceof Types.ObjectId
    ) {
        return (doc as any).toString();
    }

    // 5. Xử lý Object: Tách _id, __v và phần còn lại
    const { _id, __v, ...rest } = doc as any;

    const newDoc: any = {};

    // Chỉ tạo field 'id' nếu '_id' gốc tồn tại
    if (_id) {
        newDoc.id = _id.toString();
    }

    // Đệ quy cho các field còn lại
    Object.keys(rest).forEach((key) => {
        newDoc[key] = transformDocument(rest[key]);
    });

    return newDoc;
};

/**
 * Transform array of Mongoose lean objects
 */
export const transformDocuments = <T>(docs: T[]): any[] => {
    return docs.map((doc) => transformDocument(doc));
};
