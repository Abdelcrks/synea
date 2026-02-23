import { db } from "@/lib/db/drizzle"
import { contactRequests, conversationParticipants, conversations } from "@/lib/db/schema"
import { makeParticipantDuoId } from "@/lib/messages/makeParticipantPairId"
import { and, eq, or } from "drizzle-orm"

export async function openOrCreateConversation(fromUserId: string, toUserId: string) {
  if (fromUserId === toUserId) {
    throw new Error("impossible d'ouvrir une conversation avec soi même")
  }

  //  verif contacts accepted
  const [accepted] = await db
    .select({ id: contactRequests.id })
    .from(contactRequests)
    .where(
      and(
        eq(contactRequests.status, "accepted"),
        or(
          and(eq(contactRequests.fromUserId, fromUserId), eq(contactRequests.toUserId, toUserId)),
          and(eq(contactRequests.fromUserId, toUserId), eq(contactRequests.toUserId, fromUserId)),
        ),
      ),
    )
    .limit(1)

  if (!accepted) {
    throw new Error("vous n'êtes pas amis")
  }

  const participantDuoId = makeParticipantDuoId(fromUserId, toUserId)


  const [existing] = await db
    .select({ id: conversations.id })
    .from(conversations)
    .where(eq(conversations.participantDuoId, participantDuoId))
    .limit(1)

  let conversationId: number

  if (existing) {
    conversationId = existing.id
  } else {
    //  créer la conversation 
    // Si collision (2 users cliquent en même temps), la contrainte unique protège
    await db
      .insert(conversations)
      .values({
        participantDuoId,
        createdByUserId: fromUserId,
      })
      .onConflictDoNothing()

    // 4) reselect (la convo existe forcément maintenant)
    const [createdOrExisting] = await db
      .select({ id: conversations.id })
      .from(conversations)
      .where(eq(conversations.participantDuoId, participantDuoId))
      .limit(1)

    if (!createdOrExisting) {
      throw new Error("conversation introuvable après création")
    }

    conversationId = createdOrExisting.id
  }

  await db
    .insert(conversationParticipants)
    .values([
      { conversationId, userId: fromUserId, userKey: fromUserId },
      { conversationId, userId: toUserId, userKey: toUserId },
    ])
    .onConflictDoNothing()

  return conversationId
}