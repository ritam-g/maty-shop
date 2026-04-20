import rateLimit from "express-rate-limit";

export const createLimiter = ({ windowMs, max, message }) => {
  return rateLimit({
    windowMs,
    max,
    message: message || "Too many requests",
    standardHeaders: true,
    legacyHeaders: false,
  });
};