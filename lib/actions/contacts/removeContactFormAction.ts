"use server"

import { removeContact } from "./removeContact"


export async function removeContactFormAction(formData:FormData):Promise<void>{

    const result = await removeContact(formData)
    if(!result.ok){
        console.warn("removecontact echec", result.message)
    }
}