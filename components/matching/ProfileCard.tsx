"use client"

import { sendContactRequest } from "@/lib/actions/contact-requests/sendContactRequest"
import type { Profile } from "@/lib/db/queries/profile"
import Image from "next/image"
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
    <div className="mx-auto max-w-xl px-4 py-4 md:py-6">
      <div className="rounded-2xl  bg-white/60 backdrop-blur p-5 shadow-lg hover:shadow-2xl transition hover:bg-white/75">


        <Link href={`/profiles/${profile.id}`} className="block">
          <div className="flex items-start justify-between gap-4 cursor-pointer">
            <div className="min-w-0 flex items-start gap-3">
              <div className="shrink-0">
                <Avatar name={profile.namePublic} avatarUrl={profile.avatarUrl} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-lg font-semibold md:text-xl hover:underline">
                  {profile.namePublic}
                </p>

                {profile.cancerType && (
                  <p className="mt-1 text-sm text-black/60">
                    {CANCER_LABELS[profile.cancerType]}
                  </p>
                )}
              </div>
            </div>

            <span className="shrink-0 rounded-full bg-(--primary) text-white px-3 py-1 text-xs font-medium">
              {roleLabel}
            </span>
          </div>

          {profile.bio && (
            <p className="mt-4 line-clamp-4 text-sm text-black/75 italic">
              « {profile.bio} »
            </p>
          )}
        </Link>


        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            className="bg-(--primary) text-white w-full cursor-pointer hover:bg-(--primary-hover) rounded-full px-6 py-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
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
                "text-sm ",
                feedbackType === "success" ? "text-green-600!" : "",
                feedbackType === "warning" ? "text-red-600!" : "",
                feedbackType === "error" ? "text-red-600!" : "",
              ].join(" ")}
            >
              {feedback}
            </p>
          )}

        </div>
      </div>

    </div>
  )
}

