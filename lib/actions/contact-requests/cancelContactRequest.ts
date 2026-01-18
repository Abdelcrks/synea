"use server"

import { auth } from "@/lib/auth";
import { db } from "@/lib/db/drizzle";
import { contactRequests } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export type CancelContactRequest = 
| {ok:true}
| {ok:false; message:string}

export async function cancelContactRequest (requestId: number): Promise<CancelContactRequest>{
    const session = await auth.api.getSession({headers: await headers()})
        if(!session){
            return {ok:false, message:"Pas connecté"}
        }

        const updated = await db.update(contactRequests).set({
            status: "canceled",
            respondedAt: new Date()
        })
        .where(and(
            eq(contactRequests.id, requestId),
            eq(contactRequests.fromUserId, session.user.id),
            eq(contactRequests.status,"pending")
        )).returning({id:contactRequests.id})

        if(updated.length === 0){
            return {ok:false, message:"Impossible d'annuler cette demande"}

        }

    revalidatePath("/requests")
    return {ok:true}
}