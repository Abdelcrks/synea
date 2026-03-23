import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db/drizzle";
import * as appSchema from "@/lib/db/schema";
import * as authSchema from "@/lib/db/auth-schema";
import { sendEmail } from "./email/sendEmail";

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
    },
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Confirme ton adresse — Synea 💜",
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px">
            <h2 style="color:#2D1F4A">Bienvenue sur Synea 💜</h2>
            <p style="color:#444">Clique sur le bouton ci-dessous pour confirmer ton adresse email.</p>
            <a href="${url}"
              style="display:inline-block;margin-top:16px;padding:12px 24px;
                     background:#9F86C0;color:white;border-radius:8px;
                     text-decoration:none;font-weight:bold">
              Confirmer mon adresse
            </a>
            <p style="color:#999;font-size:12px;margin-top:32px">
              Si tu n'es pas à l'origine de cette inscription, ignore cet email.
            </p>
          </div>
        `,
      })
    },
    autoSignInAfterVerification: true,
  },

  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({  newEmail, url }) => {
        await sendEmail({
          to: newEmail,
          subject: "Confirme ton nouvel email — Synea 💜",
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px">
              <h2 style="color:#2D1F4A">Changement d'adresse email</h2>
              <p style="color:#444">Clique ci-dessous pour confirmer ta nouvelle adresse.</p>
              <a href="${url}"
                style="display:inline-block;margin-top:16px;padding:12px 24px;
                       background:#9F86C0;color:white;border-radius:8px;
                       text-decoration:none;font-weight:bold">
                Confirmer mon nouvel email
              </a>
            </div>
          `,
        })
      },
    },
  },

  models: {
    user: { modelName: "user" },
    session: { modelName: "session" },
    account: { modelName: "account" },
    verification: { modelName: "verification" },
  },

  plugins: [nextCookies()],
})