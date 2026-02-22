import { ROLE_LABELS } from "@/lib/constants/roles"
import Link from "next/link"
import { Avatar } from "../profile/Avatar"
import { removeContactFormAction } from "@/lib/actions/contacts/removeContactFormAction"
import { openOrCreateConversationAndRedirect } from "@/lib/actions/messages/forms/openOrCreateConversationAndRedirect"
import { MoreVertical } from "lucide-react"

type ContactUI = {
  requestId: number
  profile: {
    userId: string
    namePublic: string
    avatarUrl: string | null
    id: string
    role: "hero" | "peer_hero" | "admin"
  }
}

type ContactsContentProps = {
  contacts: ContactUI[]
}

export const ContactsContent = ({ contacts }: ContactsContentProps) => {
  if (contacts.length === 0) {
    return (
      <main className="container-page section">
        <div className="card card--outline text-center">
          <h2 className="text-lg font-semibold">Aucun contact pour le moment</h2>
          <p className="mt-2 text-sm muted">
            Accepte une demande ou lance un matching pour commencer une discussion.
          </p>

          <Link href="/matching" className="btn btn--primary mt-5 w-full sm:w-auto">
            Trouver des personnes
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container-page section">
      {/* Header */}
      <header className="space-y-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold md:text-3xl">Contacts</h1>
            <p className="mt-1 text-sm muted">Vos contacts ({contacts.length})</p>
          </div>

          <Link href="/requests" className="btn btn--secondary w-full sm:w-auto">
            Demandes
          </Link>
        </div>
      </header>

      {/* List */}
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {contacts.map(({ requestId, profile }) => (
          <li key={requestId} className="card card--outline">
            <div className="flex items-start justify-between gap-4">
              <Link
                href={`/profiles/${profile.id}`}
                className="min-w-0 flex items-center gap-4"
              >
                <div className="shrink-0">
                  <Avatar
                    name={profile.namePublic}
                    avatarUrl={profile.avatarUrl}
                    sizeClassName="h-14 w-14 md:h-16 md:w-16"
                  />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-base font-semibold hover:underline">
                    {profile.namePublic}
                  </p>
                  <p className="truncate text-sm muted">{ROLE_LABELS[profile.role]}</p>
                </div>
              </Link>

              <div className="flex items-center gap-2 shrink-0">
                <form action={openOrCreateConversationAndRedirect}>
                  <input type="hidden" name="toUserId" value={profile.userId} />
                  <button type="submit" className="btn btn--primary">
                    Message
                  </button>
                </form>

                <details className="relative">
                <summary
                  className="btn btn--ghost btn--icon md:w-12 md:h-12"
                  aria-label="Options"
                  >
                  <MoreVertical className="h-5 w-5 md:h-6 md:w-6" />
                </summary>

                  <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black/5">
                    <form action={removeContactFormAction}>
                      <input type="hidden" name="requestId" value={requestId} />
                      <input type="hidden" name="profileId" value={profile.id} />
                      <button
                        type="submit"
                        className="w-full cursor-pointer px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-600 hover:text-white transition"
                      >
                        Supprimer le contact
                      </button>
                    </form>
                  </div>
                </details>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}