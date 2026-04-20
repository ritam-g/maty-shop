
import { RATE_LIMITS } from "../../config/rateLimit.config.js";
import { createLimiter } from "./factory.js";


export const authLimiter = createLimiter({
    ...RATE_LIMITS.AUTH,
    message: "Too many requests from this IP, please try again after an hour",
});