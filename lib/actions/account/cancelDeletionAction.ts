"use server"


import { db } from "@/lib/db/drizzle"
import { users } from "@/lib/db/auth-schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { requireSession } from "../auth/requireSession"

export async function cancelDeletionAction() {
  const session = await requireSession()

  await db.update(users)
    .set({
      disabledAt: null,
      deletionRequestedAt: null,
      deletedAt: null,
    })
    .where(eq(users.id, session.user.id))

  redirect("/profile")
}