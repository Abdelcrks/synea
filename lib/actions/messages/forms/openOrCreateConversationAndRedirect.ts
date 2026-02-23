
"use server"


import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {openOrCreateConversation} from "../openOrCreateConversation";
import { requireActiveSession } from "../../auth/requireActiveSession";


export async function openOrCreateConversationAndRedirect (formData: FormData) {
    const session = await requireActiveSession()


    const fromUserId = session.user.id

    const toUserIdBrut = formData.get("toUserId")
    if(typeof toUserIdBrut !== "string" || toUserIdBrut.length === 0){
        redirect("/messages")
    }

    const toUserId = toUserIdBrut
    if(fromUserId === toUserId){
        redirect("/messages")
    }

    const conversationId = await openOrCreateConversation(fromUserId, toUserId)

    redirect(`/messages/${conversationId}`)
}
