"use server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db/drizzle"
import { profiles } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { CANCER_TYPES, type CancerType } from "@/lib/db/schema"
import { ROLES, type Role } from "@/lib/db/schema"

 

export type UpdateProfileState = 
    | {ok:true}
    | {ok:false; field?: "namePublic" | "bio" | "locationRegion" | "cancerType" | "role" ; message:string}


export const updateProfileAction =  async (_prevState:UpdateProfileState| null, formData: FormData):Promise<UpdateProfileState>=> {

    
    const session = await auth.api.getSession({headers: await headers()})
    if(!session?.user){
       return {ok:false, message: "non autorisé"}
    }

    const namePublic = formData.get("namePublic")?.toString().trim()
    const bio = formData.get("bio")?.toString() ?? null
    const locationRegion = formData.get("locationRegion")?.toString() ?? null
    const cancerTypeBrut = formData.get("cancerType")?.toString() || ""
        let cancerType:CancerType|null = null
    if(cancerType !== ""){
        if (!CANCER_TYPES.includes(cancerTypeBrut as CancerType)){
            return {ok:false, field:"cancerType", message:"Type de cancer invalide"}
        }
        cancerType = cancerTypeBrut as CancerType
    }

    const roleBrut = formData.get("role")?.toString()
    if(!roleBrut){
        return {ok:false, field:"role", message:"Veuillez choisir un rrole"}
    }
    if(!ROLES.includes(roleBrut as Role) || roleBrut === "admin"){
        return {ok:false, field:"role" , message : "role invalide"}
    }
    const role = roleBrut as Role

    if(!namePublic || namePublic.length < 2 ){
        return {ok:false, field:"namePublic", message:"Le nom doit contenir au moins 2 caractères"}
    }

    await db
    .update(profiles)
    .set({
        namePublic,
        bio,
        locationRegion,
        cancerType,
        role,
        updatedAt: new Date() 
    })
    .where(eq(profiles.userId, session.user.id))

    revalidatePath("/profile")
    redirect("/profile")

}