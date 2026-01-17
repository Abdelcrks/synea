"use client"

import { sendContactRequest } from "@/lib/actions/contact-requests/sendContactRequest"
import type { Profile } from "@/lib/db/queries/profile"
import { useState } from "react"

type ProfileCardProps = {
    profile:  Profile
}
export function ProfileCard ({profile}: ProfileCardProps)  {
    const [feedback, setFeedback] = useState<string | null > (null)
    const [disabled, setDisabled] = useState(false)


    const sendContact = async () => {
        setDisabled(true)
        const response = await sendContactRequest(profile.userId)
        console.log(response)
        if(response.ok){
            setFeedback("Demande envoyée")
        } else if (response.field === "already_exists"){
            setFeedback("Demande déjà envoyer")
        } else {
            setFeedback(response.message)
            setDisabled(false)
        }
    }

    return(
        <div>
            <div>
            <p>{profile.namePublic}</p>
            <p>{profile.role}</p>
            <p>{profile.cancerType}</p>
            <button className="bg-amber-300" disabled={disabled} onClick={sendContact}>Envoyer une demande</button>
            {feedback &&
                <p className="text-red-600">{feedback}</p>
            }
            </div>
           
        </div>
    )
}