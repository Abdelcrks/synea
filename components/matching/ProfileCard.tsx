"use client"

import { sendContactRequest } from "@/lib/actions/contact-requests/sendContactRequest"
import type { Profile } from "@/lib/db/queries/profile"
import { useState } from "react"
import { CANCER_LABELS } from "@/lib/constants/cancer"
import { Avatar } from "../profile/Avatar"
import Link from "next/link"
import { useRouter } from "next/navigation"


type ProfileCardProps = {
  profile: Profile
  requestStatus: "pending" | "accepted" | "rejected" | "canceled" | null
  requestFromMe: boolean
}

type FeedBackType = "success" | "warning" | "error"


export function ProfileCard({ profile, requestFromMe, requestStatus }: ProfileCardProps) {
  const [feedback, setFeedback] = useState<string | null>(null)
  const [disabled, setDisabled] = useState(false)
  const router = useRouter()
  const [feedbackType, setFeedbackType] = useState<FeedBackType>("success")


  const isDisabledByStatus = requestStatus === "pending" || requestStatus === "accepted"

  const sendContact = async () => {
    if (isDisabledByStatus) return
    setFeedback(null)
    setDisabled(true)

    const response = await sendContactRequest(profile.userId)
    console.log(response)

    if (response.ok) {
      setFeedback("Demande envoyée")
      setFeedbackType("success")
      router.refresh()
      return

    } else if (response.field === "already_exists") {
      setFeedback("Demande déjà envoyer")
      setFeedbackType("warning")
      setDisabled(false)
      router.refresh()
      return

    } else {
      setFeedback(response.message)
      setFeedbackType("error")
      setDisabled(false)

    }
  }
  const label = requestStatus === "pending" ? (requestFromMe ? "Demande en attente" : "Demande reçue") : requestStatus === "accepted" ? "déjà acceptés" : "envoyer une demande"

  const roleLabel = profile.role === "hero" ? "Héros" : profile.role === "peer_hero" ? "Pair-héros" : profile.role

  return (
    <div className="card">
      <Link href={`/profiles/${profile.id}`} className="block">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex items-start gap-3">
            <div className="shrink-0">
              <Avatar
                name={profile.namePublic}
                avatarUrl={profile.avatarUrl}
                sizeClassName="h-16 w-16 md:h-20 md:w-20"
              />
            </div>
  
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold md:text-xl hover:underline">
                {profile.namePublic}
              </p>
  
              {profile.cancerType && (
                <p className="mt-1 text-sm muted">
                  {CANCER_LABELS[profile.cancerType]}
                </p>
              )}
            </div>
          </div>
  
          <span
            className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
            style={{ background: "var(--primary-soft)", color: "var(--text-main)" }}
          >
            {roleLabel}
          </span>
        </div>
  
        {profile.bio && (
          <p className="mt-4 line-clamp-4 text-sm italic text-black/75">
            « {profile.bio} »
          </p>
        )}
      </Link>
  
      <div className="mt-5 flex flex-col gap-2  sm:items-center sm:justify-between">
        <button
          className="btn btn--primary w-full "
          disabled={disabled || isDisabledByStatus}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            sendContact()
          }}
        >
          {label}
        </button>
  
        {feedback && (
          <p 
            className={[
              "text-sm",
              feedbackType === "success" ? "text-green-600" : "",
              feedbackType === "warning" ? "text-red-600" : "",
              feedbackType === "error" ? "text-red-600" : "",
            ].join(" ")}
          >
            {feedback}
          </p>
        )}
      </div>
    </div>
  )
}

