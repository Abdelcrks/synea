"use server"

export type CreateAccountState =
    | {ok :true} 
    | {ok:false; field?: "email" | "password" | "namePublic" | "acceptedTerms" ; message:string}

export const createAccountAction = async (_prevState: CreateAccountState | null , formData:FormData):Promise<CreateAccountState> => {

    const role = formData.get("role")?.toString()
    const namePublic= (formData.get("namePublic")?.toString() ?? "").trim()
    const email = (formData.get("email")?.toString() ?? "").trim()
    const password = formData.get("password")?.toString() ?? ""
    const acceptedTerms = formData.get("acceptedTerms") === "on"

    if(!namePublic || namePublic.length < 2) {
        return {ok: false, field : "namePublic", message : "Le pseudo doit faire au moins 2 caractères"}
    }
    if (!email.includes("@")) {
        return { ok: false, field: "email", message: "Email invalide." }
    }
    if(password.length<8){
        return {ok:false, field : "password" , message: "mot de passe trop court (8 caractères minimum)"}
    }
    if(!acceptedTerms){
        return{ok:false, field: "acceptedTerms", message : "veuillez acceptez les CGU."}
    }


    console.log("FORM DATA RECU RECU")
    console.log(Object.fromEntries(formData.entries()))

    return {ok: true}
    
}