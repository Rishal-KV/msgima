import { RedisOptions } from "bullmq";
import { ENV } from "./env";

export const redisConnection: RedisOptions = {
host: ENV.redis.host,
port: ENV.redis.port,
password: ENV.redis.password,
};
