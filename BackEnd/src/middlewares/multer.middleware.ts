import multer from "multer";

const storage = multer.memoryStorage();
const limits = {
    fileSize: 5 * 1024 * 1024,
};

const upload = multer({
    storage: storage,
    limits: limits,
    fileFilter: (req, file, callback) => {
        if (file.mimetype.startsWith("image/")) {
            callback(null, true);
        } else {
            // @ts-ignore
            callback(new Error("Chỉ cho phép file ảnh!"), false);
        }
    },
});

export default upload;
