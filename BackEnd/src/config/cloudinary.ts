import { v2 as cloudinary } from "cloudinary";
import { configEnv } from "./env";

export const connectCloudinary = () => {
    try {
        cloudinary.config({
            cloud_name: configEnv.cloudiary_cloud_name,
            api_key: configEnv.cloudiary_api_key,
            api_secret: configEnv.cloudiary_api_secret,
        });
    } catch (error) {
        process.exit(1);
    }
};

export default cloudinary;
