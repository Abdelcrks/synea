"use client"

import { cancelContactRequest } from "@/lib/actions/contact-requests/cancelContactRequest"
import type { Profile } from "@/lib/db/queries/profile"
import { useState } from "react"

type RequestCardProps = {
 profile : Profile
 type: "received" | "sent"
 requestId: number
}



export const RequestCard = ({profile, type, requestId}: RequestCardProps) => {
    const [loading, setLoading] = useState(false)
    const [feedback, setFeedback] = useState<string | null>(null)

    const onCancel = async () => {
        setLoading(true)
        setFeedback(null)
        const response = await cancelContactRequest(requestId)
        if(!response.ok){
            setFeedback(response.message)
            setLoading(false)
        }
    }
   
    return(
        <div className="space-y-1 flex flex-col items-center gap-5 border shadow-2xl border-[#9F86C0] rounded-xl hover:bg-white/90">
            <p>{type === "received" ? "Demande de : " : "Demande envoyé à :"} {profile.namePublic}</p>
            <p>{profile.role}</p>
            <p>{profile.locationRegion ?? "Region non renseignée"}</p>

            {/* pr debug  */}      
            <p className="text-xs opacity-50">requestId:{requestId}</p> 

            {type === "sent" && (
                <div>
                    <button className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded-full" 
                    onClick={onCancel}>{loading? "Annulation.." : "Annuler"}
                    </button>
                    {feedback && (
                        <p className="text-red-600 text-sm">{feedback}</p>
                    )}
                </div>
            )}
              
        </div>
    )
}