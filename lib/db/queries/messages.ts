import { and, asc, eq, ne } from "drizzle-orm";
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

        senderNamePublic : profiles.namePublic,
        senderAvatarUrl : profiles.avatarUrl,
        senderProfileId: profiles.id,
    }).from(messages)
    .leftJoin(profiles,eq(messages.senderId, profiles.userId))
    .where(eq(messages.conversationId, conversationId))
    .orderBy(asc(messages.createdAt))
}



export async function getOtherUserId (conversationId:number, myUserId:string){

    const [otherParticipant] = await db.select({userId : conversationParticipants.userId}).from(conversationParticipants) // je veux l'id de l'autre prsn
    .where(
        and(
            eq(conversationParticipants.conversationId, conversationId), // mm conv
            ne(conversationParticipants.userId, myUserId) // pas moi
        )
    ).limit(1) // 1 pers

    return otherParticipant?.userId ?? null // si aucune pers = null
}