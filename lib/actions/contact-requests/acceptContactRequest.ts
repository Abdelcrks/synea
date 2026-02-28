"use server"

import { db } from "@/lib/db/drizzle"
import { contactRequests } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { requireActiveSession } from "../auth/requireActiveSession"

export type AcceptContactRequestResult =
  | { ok: true }
  | { ok: false; message: string }

export async function acceptContactRequest(requestId: number): Promise<AcceptContactRequestResult> {
  const session = await requireActiveSession()

  if (!Number.isInteger(requestId) || requestId <= 0) {
    return { ok: false, message: "Requête invalide" }
  }

  const updated = await db
    .update(contactRequests)
    .set({
      status: "accepted",
      respondedAt: new Date(),
    })
    .where(
      and(
        eq(contactRequests.id, requestId),
        eq(contactRequests.toUserId, session.user.id), //  seul le destinataire peut accepter
        eq(contactRequests.status, "pending"), // seulement si pending
      ),
    )
    .returning({ id: contactRequests.id })

  if (updated.length === 0) {
    return { ok: false, message: "Impossible d'accepter cette demande" }
  }

  revalidatePath("/requests")
  return { ok: true }
}

