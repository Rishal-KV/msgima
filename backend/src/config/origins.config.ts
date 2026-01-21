import { ENV } from "./env";

const allowedOrigins = ENV.app.corsAllowedOrigins.split(",");
console.log({ allowedOrigins })

export { allowedOrigins };
