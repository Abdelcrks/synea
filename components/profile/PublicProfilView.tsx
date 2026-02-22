import Image from "next/image"
import Link from "next/link"
import { CANCER_LABELS } from "@/lib/constants/cancer"
import { ROLE_LABELS } from "@/lib/constants/roles"
import type { PublicProfile } from "@/lib/db/queries/profile"
import { Avatar } from "./Avatar"
import { sendContactRequestForm } from "@/lib/actions/contact-requests/forms/sendFromProfile"
import { cancelContactRequestForm } from "@/lib/actions/contact-requests/forms/cancelFromProfile"
import { acceptContactRequestForm } from "@/lib/actions/contact-requests/forms/acceptFromProfile"
import { rejectContactRequestForm } from "@/lib/actions/contact-requests/forms/rejectFromProfile"
import type { RelationStatus } from "@/app/(app)/profiles/[id]/page"
import { removeContactFormAction } from "@/lib/actions/contacts/removeContactFormAction"
import { openOrCreateConversationAndRedirect } from "@/lib/actions/messages/forms/openOrCreateConversationAndRedirect"

type PublicProfileViewProps = {
  profile: PublicProfile
  relationStatus: RelationStatus
  requestId: number | null
}

export function PublicProfileView({ profile, relationStatus, requestId }: PublicProfileViewProps) {
  const renduProfilStatus = () => {
    if (relationStatus === "self") {
      return (
        <div className="w-full space-y-3 pt-2">
          <p className="text-sm muted text-center">Ceci est votre profil public.</p>
          <Link href="/profile" className="btn btn--primary w-full">
            Aller à mon profil
          </Link>
        </div>
      )
    }

    if (relationStatus === "connected") {
      return (
        <div className="w-full pt-2 grid gap-3 sm:grid-cols-2">
          <form action={openOrCreateConversationAndRedirect} className="w-full">
            <input type="hidden" name="toUserId" value={profile.userId} />
            <button type="submit" className="btn btn--primary w-full">
              Envoyer un message
            </button>
          </form>

          {requestId ? (
            <form action={removeContactFormAction} className="w-full">
              <input type="hidden" name="requestId" value={requestId} />
              <input type="hidden" name="profileId" value={profile.id} />
              <button type="submit" className="btn btn--destructive w-full">
                Supprimer le contact
              </button>
            </form>
          ) : (
            <button disabled className="btn w-full" aria-disabled="true">
              Contact
            </button>
          )}
        </div>
      )
    }

    if (relationStatus === "pending_outgoing") {
      return (
        <div className="w-full pt-2">
          {requestId ? (
            <form action={cancelContactRequestForm} className="w-full">
              <input type="hidden" name="requestId" value={String(requestId)} />
              <input type="hidden" name="profileId" value={profile.id} />

              <button type="submit" className="btn btn--secondary w-full">
                Annuler la demande
              </button>
            </form>
          ) : (
            <button disabled className="btn btn--secondary w-full" aria-disabled="true">
              Demande en cours
            </button>
          )}
        </div>
      )
    }

    if (relationStatus === "pending_incoming") {
      return (
        <div className="w-full pt-2 grid gap-3 sm:grid-cols-2">
          {requestId ? (
            <>
              <form action={acceptContactRequestForm} className="w-full">
                <input type="hidden" name="requestId" value={String(requestId)} />
                <input type="hidden" name="profileId" value={profile.id} />
                <button type="submit" className="btn btn--primary w-full">
                  Accepter
                </button>
              </form>

              <form action={rejectContactRequestForm} className="w-full">
                <input type="hidden" name="requestId" value={String(requestId)} />
                <input type="hidden" name="profileId" value={profile.id} />
                <button type="submit" className="btn btn--secondary w-full">
                  Refuser
                </button>
              </form>
            </>
          ) : (
            <button disabled className="btn btn--secondary w-full" aria-disabled="true">
              Demande reçue
            </button>
          )}
        </div>
      )
    }

    return (
      <div className="w-full pt-2">
        <form action={sendContactRequestForm} className="w-full">
          <input type="hidden" name="toUserId" value={profile.userId} />
          <input type="hidden" name="profileId" value={profile.id} />
          <button type="submit" className="btn btn--primary w-full">
            Envoyer une demande
          </button>
        </form>
      </div>
    )
  }

  return (
    <section className="container-page section space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold md:text-3xl">Profil</h1>
        <p className="text-sm muted">
          Aperçu public — informations partagées avec la communauté
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4 space-y-6">
          <div className="card card--outline text-center">
            <div className="flex justify-center">
              {profile.avatarUrl ? (
                <Image alt={`Avatar de ${profile.namePublic}`} fill src={profile.avatarUrl} />
              ) : (
                <Avatar name={profile.namePublic} avatarUrl={profile.avatarUrl} sizeClassName="h-24 w-24 lg:h-40 lg:w-40" />
              )}
            </div>

            <h2 className="mt-4 text-xl font-semibold">{profile.namePublic}</h2>

            <div className="mt-2 flex items-center justify-center">
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: "var(--primary-soft)", color: "var(--text-muted)" }}
              >
                {ROLE_LABELS[profile.role]}
              </span>
            </div>

            <p className="mt-2 text-sm muted">
              {profile.locationRegion ?? "Région non renseignée"}
            </p>

            {renduProfilStatus()}
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="card card--outline">
            <h3 className="font-semibold">À propos</h3>
            <p className="mt-2">{profile.bio ?? "Aucune bio."}</p>
          </div>

          <div className="card card--outline">
            <h3 className="font-semibold">Informations (optionnel)</h3>
            <p className="mt-2">
              Type de cancer (optionnel) :{" "}
              {profile.cancerType ? CANCER_LABELS[profile.cancerType] : "Non renseigné"}
            </p>
            <p className="mt-2 text-xs italic muted">
              Ces informations sont facultatives. Chaque membre choisit ce qu’il partage.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}