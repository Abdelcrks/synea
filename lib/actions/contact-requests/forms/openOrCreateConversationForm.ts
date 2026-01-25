
"use server"


import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {openOrCreateConversation} from "../../messages/openOrCreateConversation";


export async function openOrCreateConversationFromProfile (formData: FormData) {
    const session = await auth.api.getSession({headers: await headers()})
    if (!session){
        redirect("/auth/sign-in")
    }

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
