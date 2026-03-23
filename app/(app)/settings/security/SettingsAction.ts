"use server"

import { requireActiveSession } from "@/lib/actions/auth/requireActiveSession";
import { auth } from "@/lib/auth"
import { headers } from "next/headers"


export type UpdateSettingsActionState = 
    | {ok:true}
    | {ok:false; field?: "newPassword" | "newEmail" |"currentPassword" ; message:string}


export const updateEmailAction = async (_prevState: UpdateSettingsActionState | null , formData: FormData):Promise<UpdateSettingsActionState>=>{

    await requireActiveSession()

    const email = formData.get("newEmail")?.toString().trim()
    if(!email || !email?.includes("@") || !email?.includes(".")){
        return {ok:false, field:"newEmail", message: "email non valide"}
    }

    try {
        await auth.api.changeEmail({
            headers: await headers(),
            body: {
                newEmail: email,
                callbackURL: "/profile"
            }
        })
        return {ok:true}

    } catch (error: unknown) {
        const errorCode = (error as { body?: { code?: string } })?.body?.code
        if(errorCode === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"){
            return {ok:false, field:"newEmail", message:"Cet email est déjà utilisé"}
        }
        return {ok: false, message:"Impossible de changer l'email"}
    }
}


export const updatePasswordAction = async (_prevState: UpdateSettingsActionState | null , formData: FormData): Promise<UpdateSettingsActionState>=>{

    await requireActiveSession()

    const currentPassword = formData.get("currentPassword")?.toString()
    const password = formData.get("newPassword")?.toString()

    if(!password){
        return {ok:false, field:"newPassword", message: "mot de passe non valide"}
    }

    if(!currentPassword){
        return {ok:false, field:"currentPassword", message: "mot de passe non valide"}
    }

    if(password?.length < 8){
        return {ok:false, field:"newPassword", message:"Mot de passe trop court minimum 8 caractères"}
    }

    if(currentPassword === password){
        return {ok:false, field: "newPassword", message:"Le mot de passe doit être différent de l'ancien mot de passe"}
    }

    try {
        await auth.api.changePassword({
            headers: await headers(),
            body: {
                newPassword: password,
                currentPassword: currentPassword,
                revokeOtherSessions: false
            }
        })
        return {ok:true}

    } catch (error: unknown) {
        const errorCode = (error as { body?: { code?: string } })?.body?.code
        console.log("changepassword erreur : ", errorCode)
        if(errorCode === "INVALID_PASSWORD"){
            return {ok:false, field:"currentPassword", message:"Mot de passe actuel incorrect"}
        }
        return {ok:false, message:"impossible de changer le mot de passe"}
    }
}