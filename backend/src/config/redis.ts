import { RedisOptions } from "bullmq";

export const redisConnection: RedisOptions = {
  connectionName: "render-redis",
  url: process.env.REDIS_URL!,
};
