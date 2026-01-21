"use client"

import { sendContactRequest } from "@/lib/actions/contact-requests/sendContactRequest"
import type { Profile } from "@/lib/db/queries/profile"
import Image from "next/image"
import { useState } from "react"
import { CANCER_LABELS } from "@/lib/constants/cancer"


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

    const roleLabel = profile.role === "hero" ? "Héros" : profile.role === "peer_hero" ? "Pair-héros" : profile.role

    return(
<div className="mx-auto max-w-xl px-4 py-4 md:py-6">
  <div className="rounded-2xl border border-(--primary)]/40 bg-white/60 backdrop-blur p-5 shadow-sm transition hover:bg-white/75">
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="truncate text-lg font-semibold md:text-xl">
          {profile.namePublic}
        </p>

        {profile.cancerType && (
          <p className="mt-1 text-sm text-black/60">
            {CANCER_LABELS[profile.cancerType]}
          </p>
        )}
      </div>

      <span className="shrink-0 rounded-full bg-(--primary)]/10 px-3 py-1 text-xs font-medium text-(--primary)]">
        {roleLabel}
      </span>
    </div>

    {profile.bio && (
      <p className="mt-4 line-clamp-4 text-sm text-black/75 italic">
        « {profile.bio} »
      </p>
    )}

    <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <button
        className="btn-primary w-full rounded-full px-6 py-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        disabled={disabled || isDisabledByStatus}
        onClick={sendContact}
      >
        {label}
      </button>

      {feedback && (
        <p className="text-sm text-red-600">
          {feedback}
        </p>
      )}
    </div>
  </div>
</div>
    )
}