import { z } from "zod";
import { ObjectId } from "mongodb";

export const zodObjectId = z.string().transform((val, ctx) => {
    if (!ObjectId.isValid(val)) {
        return z.NEVER;
    }
    return new ObjectId(val);
});
