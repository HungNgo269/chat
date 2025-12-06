import mongoose from "mongoose";
import { configEnv } from "./env";

class Database {
    async connect(): Promise<void> {
        try {
            await mongoose.connect(configEnv.mongo_url, {
                dbName: configEnv.db_name,
                serverSelectionTimeoutMS: 5000, //tránh treo
            });
        } catch (error) {
            process.exit(1);
        }
    }

    async disConnect(): Promise<void> {
        try {
            await mongoose.disconnect();
        } catch (error) {
            process.exit(1);
        }
    }
}

export default new Database();
