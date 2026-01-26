import { Avatar } from "@/components/profile/Avatar"
import { auth } from "@/lib/auth"
import { getInbox } from "@/lib/db/queries/inbox"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function MessagesPage() {
  const session = await auth.api.getSession({headers: await headers()})
  if(!session){
    redirect("/auth/sign-in")
  }

  const inbox = await getInbox(session.user.id)
  if(inbox.length === 0){
    return (
      <main className="mx-auto w-full max-w-3xl px-4 pb-20 pt-4">
    
        <div className="space-y-1">
                <div className="flex items-center justify-between gap-3">
                    <h1 className="text-2xl font-semibold">Messages</h1>

                    <Link
                    href="/contacts"
                    className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold bg-(--primary) text-white"
                    >
                    Mes contacts
                    </Link>
                </div>
                <p className="text-sm text-muted-foreground">
                    aucun message pour le moment
                </p>
            </div>
      </main>
    )
  }
  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-20 pt-4">
      <div className="space-y-1">
          <div className="flex items-center justify-between gap-3">
              <h1 className="text-2xl font-semibold">Messages</h1>

              <Link
              href="/contacts"
              className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold bg-(--primary) text-white"
              >
              Mes demandes
              </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            Vos dernières conversations :
          </p>
        </div>
      {/* <h1 className="text-xl font-semibold">Messages</h1> */}

      <ul className="mt-6 space-y-3">
        {inbox.map((conv) => (
          <li key={conv.conversationId}>
            <Link
              href={`/messages/${conv.conversationId}`}
              className="block rounded-2xl border bg-white/60 p-4 shadow-sm transition hover:bg-white/80"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12">
                  <Avatar
                    name={conv.otherProfile.namePublic ?? "?"}
                    avatarUrl={conv.otherProfile.avatarUrl ?? null}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{conv.otherProfile.namePublic}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {conv.lastMessage.content}
                  </p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
  }
  