import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

/**
 * Loads environment variables based on the current NODE_ENV
 */
export const loadEnv = (): void => {
  const NODE_ENV = process.env.NODE_ENV || "development";

  const envPaths = [
    path.resolve(process.cwd(), `.env.${NODE_ENV}.local`),
    path.resolve(process.cwd(), `.env.${NODE_ENV}`),
    path.resolve(process.cwd(), ".env.local"),
    path.resolve(process.cwd(), ".env"),
  ];

  const envPath = envPaths.find((filePath) => fs.existsSync(filePath));

  if (envPath) {
    dotenv.config({ path: envPath });
  } else {
    dotenv.config();
  }

  // Validate required environment variables
  const requiredEnvVars = ["MONGO_URI"];
  const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missingEnvVars.length > 0 && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
  }
};

loadEnv();

export const ENV = {
  app: {
    nodeEnv: process.env.NODE_ENV || "development",
    port: process.env.PORT || "8000",
    corsAllowedOrigins: process.env.CORS_ALLOWED_ORIGINS || "http://localhost:5173/"
  },
  db: {
    mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/msigma",
  },
  redis: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    password: process.env.REDIS_PASSWORD || undefined,
  }
};
