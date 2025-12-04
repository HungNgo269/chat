import mongoose from "mongoose";
import { configEnv } from "./env";

class Database {
    async connect(): Promise<void> {
        try {
            await mongoose.connect(configEnv.mongo_url, {
                dbName: configEnv.db_name,
                serverSelectionTimeoutMS: 5000, //tránh treo
            });
            console.log("Connected with MongoDb");
        } catch (error) {
            console.error("MongoDB connection error:", error);
            process.exit(1);
        }
    }

    async disConnect(): Promise<void> {
        try {
            await mongoose.disconnect();
            console.log("DisConnected with MongoDb");
        } catch (error) {
            console.error("MongoDB connection error:", error);
            process.exit(1);
        }
    }
}

export default new Database();
