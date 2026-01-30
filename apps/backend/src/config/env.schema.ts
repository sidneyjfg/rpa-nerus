import { z } from "zod";

const boolFromString = z
  .string()
  .transform((v) => v.trim().toLowerCase())
  .refine((v) => ["true", "false"].includes(v))
  .transform((v) => v === "true");

const intFromString = z
  .string()
  .transform((v) => Number(v))
  .refine((v) => Number.isInteger(v));

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_PORT: intFromString.default(3000),

  DB_TYPE: z.literal("mysql").default("mysql"),
  DB_HOST: z.string().min(1),
  DB_PORT: intFromString.default(3306),
  DB_USER: z.string().min(1),
  DB_PASS: z.string().min(1),
  DB_NAME: z.string().min(1),

  DB_SSL: boolFromString.default(false),

  DOWNLOAD_BASE_PATH: z.string().min(1).default("./downloads"),

  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
});

export type Env = z.infer<typeof envSchema>;
