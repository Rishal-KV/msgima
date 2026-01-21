import { ENV } from "./env";

const allowedOrigins = ENV.app.corsAllowedOrigins.split(",");

export { allowedOrigins };
