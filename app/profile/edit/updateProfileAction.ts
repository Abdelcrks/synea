"use server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db/drizzle"
import { profiles } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

 

export type UpdateProfileState = 
    | {ok:true}
    | {ok:false; field?: "namePublic" | "bio" | "locationRegion" ; message:string}


export const updateProfileAction =  async (_prevState:UpdateProfileState| null, formData: FormData):Promise<UpdateProfileState>=> {

    
    const session = await auth.api.getSession({headers: await headers()})
    if(!session?.user){
       return {ok:false, message: "non autorisé"}
    }

    const namePublic = formData.get("namePublic")?.toString().trim()
    const bio = formData.get("bio")?.toString() ?? null
    const locationRegion = formData.get("locationRegion")?.toString() ?? null

    if(!namePublic || namePublic.length < 2 ){
        return {ok:false, field:"namePublic", message:"Le nom doit contenir au moins 2 caractères"}
    }

    await db
    .update(profiles)
    .set({
        namePublic,
        bio,
        locationRegion,
    })
    .where(eq(profiles.userId, session.user.id))

    revalidatePath("/profile")
    redirect("/profile")

}