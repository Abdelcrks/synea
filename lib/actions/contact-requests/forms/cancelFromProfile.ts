"use server";

import { revalidatePath } from "next/cache";
import { cancelContactRequest } from "../cancelContactRequest";

export async function cancelContactRequestForm(formData: FormData): Promise<void> {
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


  await cancelContactRequest(requestId)

  revalidatePath("/requests")
  revalidatePath("/matching")
  revalidatePath(`/profiles/${profileId}`)

}
