"use server";

import { revalidatePath } from "next/cache";
import { rejectContactRequest } from "../rejectContactRequest";

export async function rejectContactRequestForm(formData: FormData): Promise<void> {

    const requestIdBrut = formData.get("requestId")
    const profileIdBrut = formData.get("profileId")


    const requestId = Number(requestIdBrut)

    if(!requestId || Number.isNaN(requestId)){
        return
    }
    const profileId = String(profileIdBrut)
    if(!profileId){
        return
    }


    await rejectContactRequest(requestId)


    revalidatePath("/requests")
    revalidatePath("/matching")
    revalidatePath(`/profiles/${profileId}`)

}
