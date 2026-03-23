"use client"

import { acceptContactRequest } from "@/lib/actions/contact-requests/acceptContactRequest"
import { cancelContactRequest } from "@/lib/actions/contact-requests/cancelContactRequest"
import { rejectContactRequest } from "@/lib/actions/contact-requests/rejectContactRequest"
import { useState } from "react"

type ProfileSummary = {
    id: string
    userId: string
    namePublic: string
    avatarUrl: string | null
    role: "hero" | "peer_hero" | "admin"
    locationRegion: string | null
  }
  
  type RequestCardProps = {
    profile: ProfileSummary
    type: "received" | "sent"
    requestId: number
  }




export const RequestCard = ({ profile, type, requestId }: RequestCardProps) => {
    const [loading, setLoading] = useState(false)
    const [feedback, setFeedback] = useState<string | null>(null)
    const [loadingReject, setLoadingReject] = useState(false)
    const [loadingAccept, setLoadingAccept] = useState(false)

    const onCancel = async () => {
        setLoading(true)
        setFeedback(null)
        const response = await cancelContactRequest(requestId)
        if (!response.ok) {
            setFeedback(response.message)
            setLoading(false)
        }
    }

    const onReject = async () => {
        setLoadingReject(true)
        setFeedback(null)
        const res = await rejectContactRequest(requestId)
        if (!res.ok) {
            setFeedback(res.message)
            setLoadingReject(false)
        }
    }

    const onAccept = async () => {
        setLoadingAccept(true)
        setFeedback(null)
        const response = await acceptContactRequest(requestId)
        if (!response.ok) {
            setFeedback(response.message)
            setLoadingAccept(false)
        }
    }
    const roleLabel = profile.role === "hero" ? "Héros" : profile.role === "peer_hero" ? "Pair-héros" : profile.role

    return (
        <div className="mx-auto max-w-xl px-4 py-4">
            <div className="rounded-2xl  bg-white/70 backdrop-blur p-5 shadow-sm hover:shadow-2xl">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <p className="text-sm text-black/60">
                            {type === "received" ? "Demande de" : "Demande envoyée à"}
                        </p>

                        <p className="truncate text-lg font-semibold">
                            {profile.namePublic}
                        </p>

                        <p className="mt-1 text-sm text-black/60">
                            {roleLabel} • {profile.locationRegion ?? "Région non renseignée"}
                        </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-(--primary)/10 px-3 py-1 text-xs font-medium text-(--primary)">
                        {type === "received" ? "Reçue" : "Envoyée"}
                    </span>
                </div>

                {/* Debug  */}
                <p className="mt-2 text-xs text-black/40">
                    requestId: {requestId}
                </p>

                <div className="mt-5">
                    {type === "sent" && (
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <button
                                className="rounded-full border border-red-500 px-5 py-2 text-sm font-medium text-red-600 cursor-pointer
                       hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={onCancel}
                                disabled={loading}
                            >
                                {loading ? "Annulation…" : "Annuler"}
                            </button>

                            {feedback && (
                                <p className="text-sm text-red-600">{feedback}</p>
                            )}
                        </div>
                    )}

                    {type === "received" && (
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <button
                                    className="rounded-full border border-red-500 px-5 py-2 text-sm font-medium text-red-600 cursor-pointer
                         hover:bg-red-50 disabled:opacity-50"
                                    onClick={onReject}
                                    disabled={loadingReject || loadingAccept}
                                >
                                    {loadingReject ? "Refus…" : "Refuser"}
                                </button>

                                <button
                                    data-testid="accept-request" // e2e accept request test
                                    className="rounded-full border border-green-600  px-5 py-2 text-sm font-medium text-green-600 cursor-pointer hover:bg-green-50
                         hover:opacity-95 disabled:opacity-50"
                                    onClick={onAccept}
                                    disabled={loadingAccept || loadingReject}
                                >
                                    {loadingAccept ? "Acceptation…" : "Accepter"}
                                </button>
                            </div>

                            {feedback && (

                                <p data-testid="request-feedback" className="text-sm text-red-600">{feedback}</p> // e2e feedback test
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}