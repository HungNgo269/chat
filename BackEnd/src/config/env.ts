import dotenv from "dotenv";

dotenv.config();

export const configEnv = {
    frontEnd_Url: process.env.FRONTEND_URL || "http://localhost:3000",
    port: process.env.PORT || 5000,
    mongo_url: process.env.MONGO_URL!,
    db_name: process.env.DB_NAME!,
    node_env: process.env.NODE_ENV || "development",
    access_tokenEx: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
    refresh_tokenEx: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
    access_secret: process.env.JWT_ACCESS_SECRET!,
    refresh_secret: process.env.JWT_REFRESH_SECRET!,
    cloudiary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    cloudiary_api_key: process.env.CLOUDINARY_API_KEY!,
    cloudiary_api_secret: process.env.CLOUDINARY_API_SECRET!,
};
