import { z } from 'zod';

export const envSchema = z.object({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string(),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string(),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string(),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string(),
  POSTGRES_URL: z.string(),
  POSTGRES_PRISMA_URL: z.string(),
  POSTGRES_URL_NON_POOLING: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DATABASE: z.string(),
  WEBHOOK_SECRET: z.string(),
  UPLOADTHING_SECRET: z.string(),
  UPLOADTHING_APP_ID: z.string(),
  DATABASE_OUTPUT: z.string().optional(),
  STRIPE_PUBLIC_KEY: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  NEXT_PUBLIC_SERVER_URL: z
    .string()
    .url()
    .optional()
    .default('https://eventos-by-gustavo.vercel.app/'),
  STRIPE_WEBHOOK_SECRET: z.string(),
});

export type EnvType = z.infer<typeof envSchema>;
