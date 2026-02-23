import { eq, desc, and, ne } from "drizzle-orm"
import { conversationParticipants, messages, profiles } from "../schema"
import { users } from "../auth-schema"
import { db } from "../drizzle"

export async function getInbox(userId: string) {
  //  userkey stable psk userId nullable au final
  const myConvs = await db
    .select({ conversationId: conversationParticipants.conversationId })
    .from(conversationParticipants)
    .where(eq(conversationParticipants.userKey, userId))

  const conversationIds = myConvs.map((r) => r.conversationId)
  if (conversationIds.length === 0) return []

  const inbox: Array<{
    conversationId: number
    otherProfile: { namePublic: string; avatarUrl: string | null }
    lastMessage: { content: string; createdAt: Date }
  }> = []

  for (const conversationId of conversationIds) {
    const [last] = await db
      .select({ content: messages.content, createdAt: messages.createdAt })
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(desc(messages.createdAt))
      .limit(1)

    if (!last) continue

    const [other] = await db
      .select({
        otherUserId: conversationParticipants.userId, // string | null
        otherUserKey: conversationParticipants.userKey, // string (not null)
      })
      .from(conversationParticipants)
      .where(
        and(
          eq(conversationParticipants.conversationId, conversationId),
          ne(conversationParticipants.userKey, userId) // ✅ compare sur userKey
        )
      )
      .limit(1)

    if (!other) continue

    //  autre user supprimé => userId NULL => placeholder direct
    if (!other.otherUserId) {
      inbox.push({
        conversationId,
        otherProfile: { namePublic: "Utilisateur", avatarUrl: null },
        lastMessage: last,
      })
      continue
    }

    //  sinon other.otherUserId est string ici
    const [otherProfileRow] = await db
      .select({
        namePublic: profiles.namePublic,
        avatarUrl: profiles.avatarUrl,
        disabledAt: users.disabledAt,
        deletionRequestedAt: users.deletionRequestedAt,
        deletedAt: users.deletedAt,
      })
      .from(profiles)
      .leftJoin(users, eq(users.id, profiles.userId))
      .where(eq(profiles.userId, other.otherUserId))
      .limit(1)

    const otherProfile = (() => {
      if (!otherProfileRow) return { namePublic: "Utilisateur", avatarUrl: null }

      const inactive =
        otherProfileRow.disabledAt !== null ||
        otherProfileRow.deletionRequestedAt !== null ||
        otherProfileRow.deletedAt !== null

      if (inactive) return { namePublic: "Utilisateur", avatarUrl: null }

      return {
        namePublic: otherProfileRow.namePublic ?? "Utilisateur",
        avatarUrl: otherProfileRow.avatarUrl ?? null,
      }
    })()

    inbox.push({ conversationId, otherProfile, lastMessage: last })
  }

  inbox.sort(
    (a, b) =>
      new Date(b.lastMessage.createdAt).getTime() -
      new Date(a.lastMessage.createdAt).getTime()
  )

  return inbox
}