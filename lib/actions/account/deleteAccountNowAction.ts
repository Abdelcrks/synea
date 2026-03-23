"use server"

import { requireActiveSession } from "@/lib/actions/auth/requireActiveSession"
import { db } from "@/lib/db/drizzle"
import { users } from "@/lib/db/auth-schema"
import { profiles } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { signOutAction } from "../auth/signOutAction"

export async function deleteAccountNowAction() {
  const session = await requireActiveSession()
  const userId = session.user.id
  const now = new Date()

  // 1) anonymise user
  await db.update(users).set({
    deletedAt: now,
    disabledAt: now,
    name: "Utilisateur supprimé",
    image: null,
    emailVerified: false,
    email: `deleted+${userId}@example.invalid`,
  }).where(eq(users.id, userId))

  // 2) anonymise profile / hide
  await db.update(profiles).set({
    isVisible: false,
    namePublic: "Utilisateur",
    avatarUrl: null,
    bio: null,
    cancerType: null,
    locationRegion: null,
    showRegionPublic: false,
    updatedAt: now,
  }).where(eq(profiles.userId, userId))

  await signOutAction()
  revalidatePath("/")
  redirect("/")

}