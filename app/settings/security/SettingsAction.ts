"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation";


export type UpdateSettingsActionState = 
    | {ok:true}
    | {ok:false; field?: "password" | "newEmail" |"currentPassword" ; message:string}


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
                callbackURL: "/settings/security"
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

    redirect("/profile")
}