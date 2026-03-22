import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  const recipient =
    process.env.NODE_ENV === "production"
      ? to
      : "abdelmoumenberkat@gmail.com" // ← toujours ton email en dev

  const { error } = await resend.emails.send({
    from: "Synea <onboarding@resend.dev>",
    to: recipient,
    subject,
    html,
  })

  if (error) {
    console.error("Erreur envoi email:", error)
    throw new Error("Échec envoi email")
  }
}