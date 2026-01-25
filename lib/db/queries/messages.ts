import { and, asc, eq } from "drizzle-orm";
import { db } from "../drizzle";
import { conversationParticipants, messages } from "../schema";

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
    }).from(messages).where(eq(messages.conversationId, conversationId)).orderBy(asc(messages.createdAt))
}