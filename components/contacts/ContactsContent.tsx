import { ROLE_LABELS } from "@/lib/constants/roles";
import Link from "next/link";
import { Avatar } from "../profile/Avatar";
import { removeContactFormAction } from "@/lib/actions/contacts/removeContactFormAction";
import { openOrCreateConversationAndRedirect } from "@/lib/actions/messages/forms/openOrCreateConversationAndRedirect";



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
          <div className="mx-auto w-full max-w-3xl px-4 pb-20 pt-4">
            <div className="rounded-2xl border-(--border) bg-(--bg-card)/70 p-6 text-center shadow-sm backdrop-blur">
              <h2 className="text-lg font-semibold text-(--text-main)">
                Aucun contact pour le moment
              </h2>
              <p className="mt-1 text-sm text-(--text-muted)">
                Accepte une demande ou lance un matching pour commencer une discussion.
              </p>
    
              <Link
                href="/matching"
                className="mt-4 inline-flex items-center justify-center rounded-full bg-(--primary) px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-(--primary-hover)"
              >
                Trouver des personnes
              </Link>
            </div>
          </div>
      )
    }

    return (
      <div className="mx-auto w-full max-w-3xl px-4 pb-20 pt-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold">Contacts</h1>
  
            <Link
              href="/requests"
              className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold bg-(--primary) text-white hover:bg-(--primary-hover)"
            >
              Demandes
            </Link>
          </div>
  
          <p className="text-sm text-muted-foreground">
            Vos contacts ({contacts.length})
          </p>
        </div>
  
        <ul className="mt-10 space-y-10">
          {contacts.map(({ requestId, profile }) => (
            <li
              key={requestId}
              className="relative z-0  flex items-center justify-between gap-4 rounded-2xl bg-white/70 px-4 py-4 shadow-sm ring-1 ring-black/5 backdrop-blur transition hover:bg-white/90 hover:shadow-md
              has-[details[open]]:z-30"
            >
              <Link
                href={`/profiles/${profile.id}`}
                className="min-w-0 flex items-center gap-4 flex-1 rounded-xl focus:outline-none focus:ring-2 focus:ring-(--primary)/50"
              >
                <div className="shrink-0">
                  <Avatar name={profile.namePublic} avatarUrl={profile.avatarUrl} sizeClassName="h-24 w-24"/>
                </div>
  
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-(--text-main) group-hover:underline">
                    {profile.namePublic}
                  </p>
                  <p className="truncate text-sm text-(--text-muted)">
                    {ROLE_LABELS[profile.role]}
                  </p>
                </div>
              </Link>
  
              <div className="flex items-center gap-2 shrink-0">
                <form action={openOrCreateConversationAndRedirect}>
                  <input type="hidden" name="toUserId" value={profile.userId} />
                  <button
                    type="submit"
                    className="inline-flex cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold text-white btn-primary"
                  >
                    Message
                  </button>
                </form>
  
                <details className="relative">
                  <summary
                    className="list-none font-bold cursor-pointer rounded-full  bg-white/60 px-3 py-2.5 text-(--text-main) hover:border hover:border-gray-500"
                    aria-label="Options"
                  >
                    ⋮
                  </summary>
  
                  <div className="absolute right-0 z-20 mt-2 w-45 overflow-hidden rounded-xl  bg-white shadow-xl ring-1 ring-black/5">
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
            </li>
          ))}
        </ul>
      </div>
    )
}
