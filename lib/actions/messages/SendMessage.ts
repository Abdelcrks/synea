"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db/drizzle"
import { isUserConversationParticipant } from "@/lib/db/queries/messages"
import { messages } from "@/lib/db/schema"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"



export async function sendMessage(formData: FormData){

    const session = await auth.api.getSession({headers: await headers()})
    if(!session){
        throw new Error("non connecté")
    }

    const conversationIdBrut = formData.get("conversationId")
    const contentBrut = formData.get("content")

    if(typeof conversationIdBrut !== "string"){
        throw new Error(" conversation id invalid")
    }

    if(typeof contentBrut !== "string"){
        throw new Error (" message invalide")
    }

    const conversationId = Number(conversationIdBrut)
    if(!conversationId || Number.isNaN(conversationId)){
        throw new Error("conversationid invalide")
    }

    const content = contentBrut.trim()
    if(content.length === 0){
        return  // pas de message vide
    }

    const isParticipant = await isUserConversationParticipant(conversationId, session.user.id)
    if(!isParticipant){
        throw new Error("Acces interdit à cette conversation")
    }

    await db.insert(messages).values({
        conversationId: conversationId,
        senderId: session.user.id,
        content : content,
    })

    revalidatePath(`/messages/${conversationId}`)
}