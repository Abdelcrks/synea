
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db/drizzle";

import * as appSchema from "@/lib/db/schema";
import * as authSchema from "@/lib/db/auth-schema";



export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...appSchema,
      ...authSchema,
      user: authSchema.users,
      account: authSchema.accounts,
      session: authSchema.sessions,
      verification: authSchema.verifications,
    }
  }),

  emailAndPassword: {
    enabled: true,
  },

  emailVerification:{ 
    sendVerificationEmail: async ({user,url}) => {
      console.log("verif email lien :", user.email)
      console.log(url)
      }
  },

  user: {
    changeEmail: {
      enabled: true,
    }
  },

  models: {
    user: { modelName: "user" },
    session: { modelName: "session" },
    account: { modelName: "account" },
    verification: { modelName: "verification" },
  },
  

  plugins: [nextCookies()],
});
