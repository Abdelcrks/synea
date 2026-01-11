"use server"

import { auth } from "@/lib/auth";
import { db } from "@/lib/db/drizzle";
import { profiles } from "@/lib/db/schema";
import { randomUUID } from "crypto";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { CANCER_TYPES, type CancerType } from "@/lib/db/schema";

// field? = erreur ss le bon input coté client 

export type CreateAccountState =
    | {ok :true} 
    | {ok:false; field?: "email" | "password" | "namePublic" | "acceptedTerms" | "role" ; message:string}

export const createAccountAction = async (_prevState: CreateAccountState | null , formData:FormData):Promise<CreateAccountState> => {

    const rawRole = formData.get("role")?.toString()
    if(rawRole !== "hero" && rawRole !== "peer_hero"){
        return {ok:false, field:"role", message:"Choisis un rôle pour continuer"}
    }
    const roleSafe = rawRole  
    const namePublic= (formData.get("namePublic")?.toString() ?? "").trim()
    const email = (formData.get("email")?.toString() ?? "").trim().toLowerCase()
    const password = formData.get("password")?.toString() ?? ""
    const acceptedTerms = formData.get("acceptedTerms") === "on" // on = case coché 
    const rawCancerType = (formData.get("cancerType")?.toString() ?? "").trim();

    let cancerType : CancerType | null = null 
    if(rawCancerType && CANCER_TYPES.includes(rawCancerType as CancerType)){ // verifie qu'il y a une valeur et qu'elle fait partie de la bdd
        cancerType = rawCancerType as CancerType // assigne après avoir filtré
    }    

    if(!namePublic || namePublic.length < 2) {
        return {ok: false, field : "namePublic", message : "Le pseudo doit faire au moins 2 caractères"}
    }
    if ( !email || !email.includes("@") || !email.includes(".")) {
        return { ok: false, field: "email", message: "Email invalide." }
    }
    if(password.length<8){
        return {ok:false, field : "password" , message: "mot de passe trop court (8 caractères minimum)"}
    }
    if(!acceptedTerms){
        return{ok:false, field: "acceptedTerms", message : "veuillez acceptez les CGU."}
    }


    console.log("FORM DATA RECU RECU")

    // return {ok: true}

    try {
        const response = await auth.api.signUpEmail({
            body: {
                email,
                password,
                name: namePublic,
            },
        })

        const userId = (response as any)?.user?.id
        if(!userId){
            console.log("SIGNUP response", response)
            return {ok:false, message: "Signup ok mais user Id est introuvable regardez niveau serveur"}
        }

        const profileId = randomUUID()

        await db.insert(profiles).values({
            id:profileId,
            userId,
            role: roleSafe,
            namePublic,
            cancerType,
            acceptedTermsAt: new Date(),
        })

        redirect("/auth/sign-in")

    } catch (error: any) {
        if(isRedirectError(error)) throw error
        console.log("SIGN UP ERROR", error)

        const msg = String(error?.message ?? "")
        const statusCode = Number(error?.statusCode ?? 0)
        
        // if (msg.toLowerCase().includes("already") || msg.toLowerCase().includes("exists")){
        //     return {ok:false, field:"email", message: "Cet email est déjà utilisé"}
        // }

        if (statusCode === 422 && msg.toLowerCase().includes("already exists")){
            return {ok: false, field:"email", message: "Cet email est déjà utilisé"}
        }

         return {ok:false, message:"Erreur serveur lors de la création du compte"}

        // console.log("SIGN UP ERROR RAW", error);
        // console.log("SIGN UP ERROR MESSAGE", error?.message);
        // console.log("SIGN UP ERROR CODE", error?.code);
    }

    
}