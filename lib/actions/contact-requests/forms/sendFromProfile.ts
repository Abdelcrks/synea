"use server";

import { revalidatePath } from "next/cache";
import { sendContactRequest } from "../sendContactRequest";

export async function sendContactRequestForm(formData: FormData):Promise<void> {

  const toUserIdRaw = formData.get("toUserId")
  const profileIdRaw = formData.get("profileId")

  const toUserId = typeof toUserIdRaw === "string" ? toUserIdRaw : ""
  if (!toUserId) {
    return
  }

  const profileId = typeof profileIdRaw === "string" ? profileIdRaw : "";
  if (!profileId){
    return
  } 
  
  await sendContactRequest(toUserId)



  revalidatePath("/requests")
  revalidatePath("/matching")
  revalidatePath(`/profiles/${profileId}`)
}
