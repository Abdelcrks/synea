"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation";


export type UpdateSettingsActionState = 
    | {ok:true}
    | {ok:false; field?: "newPassword" | "newEmail" |"currentPassword" ; message:string}


export const updateEmailAction = async (_prevState: UpdateSettingsActionState | null , formData: FormData):Promise<UpdateSettingsActionState>=>{

    const session = await auth.api.getSession({headers: await headers()})
    if(!session?.user){
       return {ok:false, message: "non autorisé"}
    }

    const email = formData.get("newEmail")?.toString().trim()
    if(!email || !email?.includes("@") || !email?.includes(".")){
        return {ok:false, field:"newEmail", message: "email non valide"}
    }
    // if(process.env.NODE_ENV === "development"){
    //     console.log("changeEmail", changeEmail)
    // }

    try {
        const changeEmail = await auth.api.changeEmail({headers: await headers(),
            body: {
                 newEmail: email,
                callbackURL: "/profile"
            }
         })

        return {ok:true}
        //  console.log("changeEmail ", changeEmail)

    } catch (error) {
        // console.log("statusCode", (error as any)?.statusCode)
        // console.log("status", (error as any)?.status)
        // console.log("body", (error as any)?.body)
        const errorCode = (error as any)?.body?.code
        if(errorCode === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"){
            return{ok:false, field:"newEmail", message:"Cet email est déjà utilisé"}
        }
        return{ ok: false, message:"Impossible de changer l'email"}
    }
    // redirect("/profile")
}


export const updatePasswordAction = async (_prevState: UpdateSettingsActionState | null , formData: FormData): Promise<UpdateSettingsActionState>=>{

    const session = await auth.api.getSession({headers: await headers()})
    if(!session?.user){
       return {ok:false, message: "non autorisé"}
    } 
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

    if(currentPassword=== password){
        return {ok:false, field: "newPassword", message:"Le mot de passe doit être différent de l'ancien mot de passe"}
    }

    try {
        const changePassword = await auth.api.changePassword({headers: await headers(),
            body: {
                newPassword: password,
                currentPassword: currentPassword,
                revokeOtherSessions: false
            }
        })
        
        return {ok:true}
    } catch (error) {
        const errorCode = (error as any)?.body?.code //maping d'erreur betterauth
        console.log("changepassword erreur : ", errorCode)
        if(errorCode == "INVALID_PASSWORD"){
            return {ok:false, field:"currentPassword", message:"Mot de passe actuel incorrect"}
        }
        return {ok:false, message:"impossible de changer le mot de passe"}
        
    }
}