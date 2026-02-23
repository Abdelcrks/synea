"use server"

import { requireActiveSession } from "@/lib/actions/auth/requireActiveSession"
import { auth } from "@/lib/auth"
import { users } from "@/lib/db/auth-schema"
import { db } from "@/lib/db/drizzle"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export async function disableAccountAction() {
  const session = await requireActiveSession()

  await db
    .update(users)
    .set({ disabledAt: new Date() })
    .where(eq(users.id, session.user.id))

  // supp la session courante
  await auth.api.signOut({
    headers: await headers(),
  })

  redirect("/account-disabled")
}