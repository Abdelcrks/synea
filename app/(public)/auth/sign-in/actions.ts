"use server"
import { auth } from "@/lib/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export type SignInState = 
    | {ok:true}
    | {ok:false; field?: "email" | "password"; message :string}

export const signInAction = async (_prev:SignInState | null, formData: FormData): Promise<SignInState> => {

    const email = (formData.get("email")?.toString() ?? "").trim().toLowerCase()
    const password = formData.get("password")?.toString() ?? ""

    if(!email.includes("@")){
        return {ok: false, field:"email", message: "email invalide"}
    }

    if(password.length < 8){
        return {ok: false, field: "password", message: "mot de passe trop court 8 caractères minimum"}
    }

    try {
        await auth.api.signInEmail({
            body: {email, password}
        })

        redirect("/profile")
    } catch (error: unknown) {
        if(isRedirectError(error)) throw error

        const err = error as { message?: string; statusCode?: number }
        const msg = String(err?.message ?? "")
        const statusCode = Number(err?.statusCode ?? 0)

        if(statusCode === 401 || msg.toLowerCase().includes("invalid")){
            return {ok: false, message: "email ou mot de passe incorrect"}
        }
    }
    return {ok: false, message: "erreur serveur lors de la connexion c'est pas ta faute"}
}