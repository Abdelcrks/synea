import { requireSession } from "@/lib/actions/auth/requireSession"
import { db } from "@/lib/db/drizzle"
import { users } from "@/lib/db/auth-schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { enableAccountAction } from "@/lib/actions/account/enableAccountAction"

export default async function AccountDisabledPage() {
  const session = await requireSession()

  const [userStatus] = await db
    .select({
      disabledAt: users.disabledAt,
      deletionRequestedAt: users.deletionRequestedAt,
      deletedAt: users.deletedAt,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1)

  if (!userStatus) redirect("/auth/sign-in")

  if (userStatus.deletedAt) redirect("/auth/sign-in")

  if (!userStatus.disabledAt) redirect("/profile")

  return (
    <main className="min-h-screen px-4 py-16 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white/70 p-6 ring-1 ring-black/5">
        <h1 className="text-xl font-semibold">Compte désactivé</h1>

        <p className="text-sm text-muted-foreground">
          Ton compte est actuellement désactivé. Tu peux le réactiver à tout moment.
        </p>

        <form action={enableAccountAction}>
          <button className="btn w-full">Réactiver mon compte</button>
        </form>
      </div>
    </main>
  )
}