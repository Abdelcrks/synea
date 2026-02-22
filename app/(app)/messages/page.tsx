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

const max100carac = (text: string, max = 100)=>{
  if(text.length <= max){ 
    return text
  }
  return text.slice(0, max) + "..."
}


  const inbox = await getInbox(session.user.id)
  if (inbox.length === 0) {
    return (
      <main className="container-page section">
        <header className="space-y-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold md:text-3xl">Messages</h1>
              <p className="mt-1 text-sm muted">Aucun message pour le moment.</p>
            </div>
  
            <Link href="/contacts" className="btn btn--secondary w-full sm:w-auto">
              Mes contacts
            </Link>
          </div>
        </header>
  
        <div className="card card--outline mt-8 text-center">
          <p className="text-sm muted">
            Commencez une discussion depuis vos contacts.
          </p>
          <Link href="/matching" className="btn btn--primary mt-4 w-full sm:w-auto">
            Trouver des personnes
          </Link>
        </div>
      </main>
    )
  }
  return (
    <main className="container-page section">
      <header className="space-y-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold md:text-3xl">Messages</h1>
            <p className="mt-1 text-sm muted">Vos dernières conversations</p>
          </div>
  
          <Link href="/contacts" className="btn btn--secondary w-full sm:w-auto">
            Mes contacts
          </Link>
        </div>
      </header>
  
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {inbox.map((conv) => (
          <li key={conv.conversationId}>
            <Link
              href={`/messages/${conv.conversationId}`}
              className="card card--outline block transition hover:shadow-md active:scale-[0.99]"
            >
            <div className="flex min-w-0 items-center gap-3">
              <Avatar
                name={conv.otherProfile.namePublic ?? "?"}
                avatarUrl={conv.otherProfile.avatarUrl ?? null}
                sizeClassName="h-12 w-12 sm:h-14 sm:w-14"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{conv.otherProfile.namePublic}</p>
                <p className="mt-1 truncate text-sm muted">
                  {max100carac(conv.lastMessage.content, 20)}
                </p>
              </div>

              <div className="shrink-0 whitespace-nowrap text-xs muted">
                {new Date(conv.lastMessage.createdAt).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
  }
  