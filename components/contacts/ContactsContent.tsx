import { ROLE_LABELS } from "@/lib/constants/roles";
import Link from "next/link";
import { Avatar } from "../profile/Avatar";
import { removeContactFormAction } from "@/lib/actions/contacts/removeContactFormAction";



type ContactUI = {
    requestId :number,
    profile:{
        userId: string;
        namePublic: string;
        avatarUrl: string | null;
        id: string ,
        role: "hero" | "peer_hero" | "admin";
    }
}

type ContactsContentProps = {
    contacts : ContactUI[]
  }

export const ContactsContent = ({ contacts }: ContactsContentProps) => {
    if (contacts.length === 0) {
        return (
            <div className="rounded-2xl border-(--border) bg-(--bg-card)/70 p-6 text-center shadow-sm backdrop-blur">
                <h2 className="text-lg font-semibold text-(--text-main)">
                    Aucun contact pour le moment
                </h2>
                <p className="mt-1 text-sm text-(--text-muted)">
                    Accepte une demande ou lance un matching pour commencer une discussion.
                </p>

                <Link
                    href="/matching"
                    className="mt-4 inline-flex items-center justify-center rounded-xl bg-(--primary) px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-(--primary-hover)"
                >
                    Trouver des personnes
                </Link>
            </div>
        )
    }

    return (
        <ul className="space-y-5">
          {contacts.map(({ requestId, profile }) => (
            <li
              key={requestId}
              className="relative hover:translate-y-1 flex items-center justify-between gap-4 rounded-2xl border-(--border) bg-(--bg-card)/70 px-5 py-5
              shadow-sm backdrop-blur transition-colors hover:bg-(--bg-card) has-[details[open]]:z-20"
            >
              {/* ZONE CLIQUABLE PROFIL */}
              <Link
                href={`/profiles/${profile.id}`}
                className="min-w-0 flex items-center gap-4 flex-1 rounded-xl focus:outline-none focus:ring-2 focus:ring-(--primary)/50"
              >
                <Avatar name={profile.namePublic} avatarUrl={profile.avatarUrl} />
      
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-(--text-main) hover:underline">
                    {profile.namePublic}
                  </p>
                  <p className="truncate text-sm text-(--text-muted)">
                    {ROLE_LABELS[profile.role]}
                  </p>
                </div>
              </Link>
      
              {/* ACTIONS (PAS CLIQUABLES POUR LE PROFIL) */}
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/messages/new?userId=${profile.userId}`}
                  className="focus:outline-none focus:ring-2 focus:ring-(--primary)/50 shrink-0 rounded-xl border-(--primary) bg-white/70 px-4 py-3 text-sm font-medium text-(--text-main) transition-colors hover:bg-(--primary-soft) hover:text-white"
                >
                  Message
                </Link>
      
                <details className="relative group">
                  <summary
                    className="list-none cursor-pointer rounded-xl border-(--border) bg-white/60 px-3 py-3
                    text-(--text-main) hover:bg-(--bg-card) transition-colors"
                    aria-label="Options"
                  >
                    ⋮
                  </summary>
      
                  <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border-(--border) bg-(--bg-card) shadow-sm">
                    <form action={removeContactFormAction}>
                      <input type="hidden" name="requestId" value={requestId} />
                      <input type="hidden" name="profileId" value={profile.id} />
                      <button
                        type="submit"
                        className="w-full cursor-pointer bg-red-600 text-white px-4 py-3 text-left text-sm hover:bg-red-800 transition-colors"
                      >
                        Supprimer le contact
                      </button>
                    </form>
                  </div>
                </details>
              </div>
            </li>
          ))}
        </ul>
      )
      
}
