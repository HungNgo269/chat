import "module-alias/register";
import app from "@/app";
import database from "@/config/database";
import { configEnv } from "@/config/env";
import http from "http";
import { InitializeWebsocket } from "@/socket";
import { connectCloudinary } from "@/config/cloudinary";

(async () => {
    try {
        await database.connect();
        const server = http.createServer(app);
        InitializeWebsocket({ server });

        server.listen(configEnv.port, () => {
            console.log(`Server running at http://localhost:${configEnv.port}`);
        });

        connectCloudinary();
    } catch (error) {
        process.exit(1);
    }
})();
