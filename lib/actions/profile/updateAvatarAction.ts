"use server"

import { auth } from "@/lib/auth";
import { db } from "@/lib/db/drizzle";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";


type UpdateAvatarResult = 
{ok:true} | {ok:false; message:string}


export async function updateAvatarAction (avatarUrl:string):Promise<UpdateAvatarResult> {
    const session = await auth.api.getSession({headers: await headers()})
    if(!session){
        return {ok:false, message:"non connecté"}
    }
    if(!avatarUrl || !avatarUrl.startsWith("https://")){
        return {ok:false, message:"url avatar incorrect"}
    }

    await db.update(profiles).set({
        avatarUrl
    }).where(eq(profiles.userId, session.user.id))

    revalidatePath("/profile")
    revalidatePath("/matching")
    revalidatePath("/contacts")
    revalidatePath("/requests")

    return{ok:true}
}