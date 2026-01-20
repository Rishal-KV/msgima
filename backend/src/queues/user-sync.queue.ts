import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

export const userSyncQueue = new Queue("user-sync-queue", {
  connection: redisConnection,
});
