"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db/drizzle"
import { contactRequests } from "@/lib/db/schema"
import { and, eq, or } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"


export type RemoveContactResult = 
| {ok:true}
| {ok:false, message:string}

export async function removeContact(formData: FormData):Promise<RemoveContactResult>{
    const session = await auth.api.getSession({headers: await headers()})
    if(!session){
        return {ok:false, message:"tu n'es pas connecté"}
    }

    const requestIdBrut = formData.get("requestId")
    const requestId = Number(requestIdBrut)
        if(!requestId || Number.isNaN(requestId) ){  // si ce nombre n'est pas un nombre = true donc request id invalide
            return {ok:false, message: "requestId invalide"}
        }
    
    await db.update(contactRequests).set({
        status:"canceled",
        respondedAt: new Date(),
    }).where(
        and(eq(contactRequests.id, requestId),eq(contactRequests.status, "accepted"),
        or(
            eq(contactRequests.fromUserId, session.user.id), eq(contactRequests.toUserId, session.user.id)
        )
    ))
    
    revalidatePath("/contacts")
    return {ok:true}
}