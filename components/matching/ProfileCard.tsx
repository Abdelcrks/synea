"use client"

import { sendContactRequest } from "@/lib/actions/contact-requests/sendContactRequest"
import type { Profile } from "@/lib/db/queries/profile"
import Image from "next/image"
import { useState } from "react"


type ProfileCardProps = {
    profile:  Profile 
    requestStatus: "pending" | "accepted" |"rejected" | "canceled" | null
    requestFromMe : boolean
}

export function ProfileCard ({profile, requestFromMe, requestStatus}: ProfileCardProps)  {
    const [feedback, setFeedback] = useState<string | null > (null)
    const [disabled, setDisabled] = useState(false)

    const isDisabledByStatus = requestStatus === "pending" || requestStatus === "accepted"

    const sendContact = async () => {
        if(isDisabledByStatus) return
        setFeedback(null)
        setDisabled(true)
        const response = await sendContactRequest(profile.userId)
        console.log(response)
        if(response.ok){
            setFeedback("Demande envoyée")
        } else if (response.field === "already_exists"){
            setFeedback("Demande déjà envoyer")
            setDisabled(false)
        } else {
            setFeedback(response.message)
            setDisabled(false)
        }
    }


    const label = requestStatus === "pending" ? (requestFromMe ? "Demande en attente" : "Demande reçue") : requestStatus === "accepted" ? "déjà acceptés" : "envoyer une demande"

    return(
            <div className="mx-auto max-w-xl p-4 md:p-8 space-y-6">
                <div className="space-y-1 flex flex-col items-center gap-3 border shadow-2xl border-[#9F86C0] rounded-xl hover:bg-white/90">
                {/* <Image width={50} height={50} alt="avatar-profile" src={profile.avatarUrl}/> */}
                <p className="text-xl font-semibold">{profile.namePublic}</p>
                <span className="px-3 py-2 text-[#9F86C0] bg-[#9F86C0]/10 ">{profile.role}</span>
                <p>{profile.cancerType}</p>
                <p className="italic font-light">«{profile.bio}»</p>
                <button className="cursor-pointer bg-[#9F86C0] text-sm font-medium rounded-full px-6 py-3 mb-5 disabled:opacity-50 disabled:cursor-not-allowed" disabled={disabled || isDisabledByStatus} onClick={sendContact}>{label}</button>
                {feedback &&
                    <p className="text-red-600">{feedback}</p>
                }
                </div>
            </div>
    )
}