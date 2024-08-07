import { z } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
  PAYFAST_POST_URL: z.string().min(1),
  PAYFAST_HOST: z.string().min(1),
  PAYFAST_MERCHANT_ID: z.string().min(1),
  PAYFAST_MERCHANT_KEY: z.string().min(1),
  PAYFAST_PASSPHRASE: z.string().min(1),
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
  NEXT_PUBLIC_PAYFAST_RETURN_URL: z.string().min(1).optional(),
  NEXT_PUBLIC_PAYFAST_CANCEL_URL: z.string().min(1).optional(),
  NEXT_PUBLIC_PAYFAST_NOTIFY_URL: z.string().min(1).optional(),
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
  NEXT_PUBLIC_PAYFAST_RETURN_URL: process.env.NEXT_PUBLIC_PAYFAST_RETURN_URL,
  NEXT_PUBLIC_PAYFAST_CANCEL_URL: process.env.NEXT_PUBLIC_PAYFAST_CANCEL_URL,
  NEXT_PUBLIC_PAYFAST_NOTIFY_URL: process.env.NEXT_PUBLIC_PAYFAST_NOTIFY_URL,
};
