"use server"

import { auth } from "@/lib/auth"
import { users } from "@/lib/db/auth-schema"
import { db } from "@/lib/db/drizzle"
import { and, eq, or } from "drizzle-orm"
import { headers } from "next/headers"
import { contactRequests, profiles } from "@/lib/db/schema"


export type SendContactRequestResult = 
    | {ok:true}
    | {ok:false, field:"unauthenticated" | "forbidden" | "already_exists" | "not_found" , message:string}



export  async function sendContactRequest (toUserId:string): Promise<SendContactRequestResult>{  // j'ai le droit d'envoyer une deamnde de mise en relation à cette personne ? si oui = demande crée si non pourquoi via le field msg" 
    const session = await auth.api.getSession({headers: await headers()})
    if(!session){
        return {ok:false, field:"unauthenticated", message:"Pas connecté"}
    }

    if(toUserId.trim().length === 0){
        return {ok:false, field:"not_found", message:"n'existe pas "}
    }

    if(toUserId === session.user.id){
        return {ok:false, field:"forbidden", message:"vous ne pouvez pas vous envoyer une demande"} 
    }


    const [targetUser] = await db.select().from(users).where(eq(users.id, toUserId)).limit(1) // verif que l'user existe que l'id correspond à un compte et qu'il est visible ((true))
    if(!targetUser){
        return {ok:false, field:"not_found", message:"user introuvable"}
    }

    

    const [myProfile] = await db.select().from(profiles).where(eq(profiles.userId, session.user.id)).limit(1) // recupere mon profile

    if(!myProfile){
        return {ok:false, field:"forbidden", message:"Profil introuvable"}
    }

    const [targetProfile] = await db.select().from(profiles).where(and(eq(profiles.userId,toUserId), eq(profiles.isVisible, true))).limit(1) // verifie que le profil ciblé a complete son profil donc pas de profil = pas de matching

    if(!targetProfile){
        return {ok:false, field:"not_found" , message: "Utilisateur introuvable ou indisponible"}
    }
    if(myProfile.role === "admin" || targetProfile.role === "admin"){
        return {ok:false, field:"forbidden", message:" action interdite"}    // bloque le contact admin donc possibilité que de contacter heros <=> pair-heros pour l'instant pas de pair-heros => pair-heros et pas sde heros=> heros
    }
    if(myProfile.role === targetProfile.role) {
        return {ok:false, field:"forbidden", message:"Vous ne pouvez contacter que des profils du rôle opposé"}
    }

    const [verifyRequest] = await db.select().from(contactRequests).where   //verifie dans les deux sens si une demande existe dans n'importe quel sens puis je bloque 
    (or(
        and(eq(contactRequests.fromUserId, session.user.id), eq(contactRequests.toUserId, toUserId)), // moi, lui     
        and(eq(contactRequests.fromUserId, toUserId), eq(contactRequests.toUserId, session.user.id)) // lui, moi   
    )).limit(1)  

    if (verifyRequest){
        return {ok:false, field:"already_exists", message:"une demande existe déjà entre vous"}
    }
     
    const [sendContactDb] = await db.insert(contactRequests).values({
        fromUserId: session.user.id,
        toUserId,
        status: "pending"
    }).returning({id:contactRequests.id})

    return {ok:true} // si tt est ok demande créer
}