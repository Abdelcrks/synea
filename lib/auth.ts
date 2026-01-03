import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db/drizzle";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  emailAndPassword: {
    enabled: true,
  },

  models: {
    user: { modelName: "user" },
    session: { modelName: "session" },
    account: { modelName: "account" },
    verification: { modelName: "verification" },
  },
  

  plugins: [nextCookies()],
});
