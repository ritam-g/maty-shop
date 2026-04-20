
import { RATE_LIMITS } from "../../config/rateLimit.config.js";
import { createLimiter } from "./factory.js";

export const productLimiter = createLimiter({
    ...RATE_LIMITS.PRODUCT,
    message: "Too many requests from this IP, please try again after an hour",
});