import pino from "pino";

/**
 * Centralized structured logger. Pretty-prints in development,
 * emits JSON lines in production for log aggregation (Vercel/Datadog/etc).
 */
export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  transport:
    process.env.NODE_ENV === "development"
      ? { target: "pino-pretty", options: { colorize: true, translateTime: "HH:MM:ss" } }
      : undefined,
  base: { service: "weproduce-backend" },
});
