"use client"

import type { Profile } from "@/lib/db/queries/profile"

type RequestCardProps = {
 profile : Profile
 type: "received" | "sent"
 requestId: number
}



export const RequestCard = ({profile, type, requestId}: RequestCardProps) => {
   
    return(
        <div className="space-y-1 flex flex-col items-center gap-5 border shadow-2xl border-[#9F86C0] rounded-xl hover:bg-white/90">
            <p>{type === "received" ? "Demande de : " : "Demande envoyé à :"} {profile.namePublic}</p>
            <p>{profile.role}</p>
            <p>{profile.locationRegion ?? "Region non renseignée"}</p>

            {/* pr debug  */}      
            <p className="text-xs opacity-50">requestId:{requestId}</p> 

            {type === "sent" && (
                            <button className="bg-red-500 text-white px-4 py-2 rounded-full">Annuler</button>
            )}
        </div>
    )
}