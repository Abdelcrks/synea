"use server"

import { revalidatePath } from "next/cache"
import { removeContact } from "./removeContact"


export async function removeContactFormAction(formData:FormData):Promise<void>{
    const profileId = String(formData.get("profileId") ?? "")


    const result = await removeContact(formData)
    if(!result.ok){

        console.warn("removecontact echec", result.message)
    }

    if(profileId){
        revalidatePath(`/profiles/${profileId}`)
    }



}