import { and, asc, eq, ne, sql } from "drizzle-orm";
import { db } from "../drizzle";
import { conversationParticipants, messages, profiles } from "../schema";

export async function isUserConversationParticipant(conversationId: number, userId:string){

    const [participant] = await db.select({id:conversationParticipants.id}).from(conversationParticipants)
    .where(and(
        eq(conversationParticipants.conversationId, conversationId),
        eq(conversationParticipants.userId, userId)
    )).limit(1)

    return Boolean(participant) // true participant false interdit
}



export async function getMessagesByConversationId(conversationId: number){
    return db.select({
        id:messages.id,
        content:messages.content,
        senderId:messages.senderId,
        createdAt: messages.createdAt,

      // ✅ fallback RGPD
      senderNamePublic: sql<string | null>`COALESCE(${profiles.namePublic}, ${messages.senderNameSnapshot})`,
      senderAvatarUrl: sql<string | null>`COALESCE(${profiles.avatarUrl}, ${messages.senderAvatarSnapshot})`,
      senderProfileId: profiles.id,
    })
    .from(messages)
    .leftJoin(profiles, eq(messages.senderId, profiles.userId))
    .where(eq(messages.conversationId, conversationId))
    .orderBy(asc(messages.createdAt));
}




export async function getOtherUserId(conversationId: number, myUserId: string) {
  const [other] = await db
    .select({ userId: conversationParticipants.userId })
    .from(conversationParticipants)
    .where(
      and(
        eq(conversationParticipants.conversationId, conversationId),
        ne(conversationParticipants.userKey, myUserId) // ✅ compare sur userKey
      )
    )
    .limit(1)

  return other?.userId ?? null
}