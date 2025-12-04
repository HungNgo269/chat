import { ObjectId } from "mongodb";

export const getValidObjectId = (id: string): ObjectId | null => {
    // Check 1: Phải là string
    if (typeof id !== "string") return null;

    // Check 2: Phải đúng format 24 ký tự hex (0-9, a-f)
    if (!/^[0-9a-fA-F]{24}$/.test(id)) return null;

    // Check 3: isValid() của MongoDB
    if (!ObjectId.isValid(id)) return null;

    // Check 4: So sánh sau khi convert
    const objectId = new ObjectId(id);
    if (String(objectId) === id) {
        return objectId;
    }

    return null;
};
