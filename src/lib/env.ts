import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  AUTH_SECRET: z.string().min(32),
  AUTH_URL: z.string().url().optional(),
  AUTH_TRUST_HOST: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  NOTIFY_EMAIL: z.string().email().optional(),
  FROM_EMAIL: z.string().optional(),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(),
  BOOTSTRAP_TOKEN: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  AUTH_URL: process.env.AUTH_URL,
  AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  NOTIFY_EMAIL: process.env.NOTIFY_EMAIL,
  FROM_EMAIL: process.env.FROM_EMAIL,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
  BOOTSTRAP_TOKEN: process.env.BOOTSTRAP_TOKEN,
  NODE_ENV: process.env.NODE_ENV,
});
