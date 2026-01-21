import cron from "node-cron";
import axios from "axios";
import logger from "../utils/logger.util";

// External URL of the server to keep it awake (Render spins down free instances after 15m of inactivity)
const APP_URL = process.env.RENDER_EXTERNAL_URL || "https://msigma.onrender.com";

// Send a ping every 14 minutes to prevent the server from sleeping
// Render's idle timeout is 15 minutes.
cron.schedule("*/5 * * * *", async () => {
    try {
        logger.info(`pinging server to keep it awake: ${APP_URL}/health`);
        const response = await axios.get(`${APP_URL}/health`);
        logger.info(`keep-alive ping successful: ${response.status}`);
    } catch (error: any) {
        logger.error(`keep-alive ping failed: ${error.message}`);
    }
});
