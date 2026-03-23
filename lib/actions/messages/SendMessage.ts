"use server"

import { db, } from "@/lib/db/drizzle"
import { areUsersContacts } from "@/lib/db/queries/contacts"
import { getOtherUserId, isUserConversationParticipant } from "@/lib/db/queries/messages"
import { messages, profiles } from "@/lib/db/schema"
import { revalidatePath } from "next/cache"
import { requireActiveSession } from "../auth/requireActiveSession"
import { eq } from "drizzle-orm"



export async function sendMessage(formData: FormData){

    const session = await requireActiveSession()

    const conversationIdBrut = formData.get("conversationId")
    const contentBrut = formData.get("content")

    if(typeof conversationIdBrut !== "string"){
        return { ok: false, message: "Données invalides." }
    }

    if(typeof contentBrut !== "string"){
        return { ok: false, message: "Conversation invalide." }
    }

    const conversationId = Number(conversationIdBrut)
    if(!conversationId || Number.isNaN(conversationId)){
        return { ok: false, message: "Données invalides." }
    }

    const content = contentBrut.trim()
    if(content.length === 0){
        return {ok:false , message: "Message vide"} // pas de message vide
    }

    const isParticipant = await isUserConversationParticipant(conversationId, session.user.id)
    if(!isParticipant){
        return { ok: false, message: "Accès interdit à cette conversation." }
    }

    const otherParticipantId = await getOtherUserId(conversationId, session.user.id)
    if(otherParticipantId === null){
        return { ok: false, message: "Conversation invalide." }
    }


    const isContact = await areUsersContacts(session.user.id, otherParticipantId)
    if(!isContact){
        return {ok: false, message:"Vous n'êtes plus en contact"}
    }

    const [senderProfile] = await db
    .select({ namePublic: profiles.namePublic, avatarUrl: profiles.avatarUrl })
    .from(profiles)
    .where(eq(profiles.userId, session.user.id))
    .limit(1)

    console.log("senderProfile:", senderProfile)

  
  await db.insert(messages).values({
    conversationId: conversationId,
    senderId: session.user.id,
    content: content,
    senderNameSnapshot: senderProfile?.namePublic ?? "Utilisateur",
    senderAvatarSnapshot: senderProfile?.avatarUrl ?? null,
  })

    revalidatePath(`/messages/${conversationId}`)
    return {ok:true}
}