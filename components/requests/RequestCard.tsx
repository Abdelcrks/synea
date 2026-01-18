"use client"

import { acceptContactRequest } from "@/lib/actions/contact-requests/acceptContactRequest"
import { cancelContactRequest } from "@/lib/actions/contact-requests/cancelContactRequest"
import { rejectContactRequest } from "@/lib/actions/contact-requests/rejectContactRequest"
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
    const [loadingReject, setLoadingReject] = useState(false)
    const [loadingAccept, setLoadingAccept] = useState(false)

    const onCancel = async () => {
        setLoading(true)
        setFeedback(null)
        const response = await cancelContactRequest(requestId)
        if(!response.ok){
            setFeedback(response.message)
            setLoading(false)
        }
    }


    const onReject = async () => {
        setLoadingReject(true)
        setFeedback(null)
        const res = await rejectContactRequest(requestId)
        if(!res.ok){
            setFeedback(res.message)
            setLoadingReject(false)
        }
    }

    const onAccept = async () => {
        setLoadingAccept(true)
        setFeedback(null)
        const response = await acceptContactRequest(requestId)
        if(!response.ok){
            setFeedback(response.message)
            setLoadingAccept(false)
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
                    <button className="bg-red-600 cursor-pointer text-white px-4 py-2 rounded-full hover:bg-red-800" 
                    onClick={onCancel}>{loading? "Annulation.." : "Annuler"}
                    </button>
                    {feedback && (
                        <p className="text-red-600 text-sm">{feedback}</p>
                    )}
                </div>
            )}

            {type === "received" && (
                <div className="flex flex-col items-center gap-3">
                    <div className="flex gap-3">
                        <button className="bg-red-600 cursor-pointer text-white px-4 py-2 rounded-full hover:bg-red-800 disabled:opacity-50" 
                        onClick={onReject} disabled={loadingReject || loadingAccept}>
                            {loadingReject? "Refuser.." : "Refuser"}
                        </button>

                        <button className="rounded-full bg-green-600 cursor-pointer text-white py-2 px-4 hover:bg-green-800 disabled:opacity-50"
                        onClick={onAccept}
                        disabled={loadingAccept || loadingReject}>
                            {loadingAccept ? "Accep..." : "Accepter"}
                        </button>
                    </div>
                    {feedback && (
                        <p className="text-red-600 text-sm">{feedback}</p>
                    )}
                </div>
            )}
              
        </div>
    )
}