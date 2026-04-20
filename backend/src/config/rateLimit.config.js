export const RATE_LIMITS = {
  AUTH: { windowMs: 60 * 1000, max: 5 },
  PRODUCT: { windowMs: 60 * 1000, max: 10 },
  VARIANT: { windowMs: 60 * 1000, max: 8 },
  GLOBAL: { windowMs: 60 * 1000, max: 100 },
};