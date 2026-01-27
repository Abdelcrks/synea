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
  if(inbox.length === 0){
    return (
      <main className="mx-auto w-full max-w-3xl px-4 pb-20 pt-4">
    
        <div className="space-y-1">
                <div className="flex items-center justify-between gap-3">
                    <h1 className="text-2xl font-semibold">Messages</h1>
                    <Link
                    href="/contacts"
                    className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold bg-(--primary) text-white hover:bg-(--primary-hover)"
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
      <div className="space-y-1 mb-3">
          <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">Messages</h1>

              <Link
              href="/contacts"
              className="items-center rounded-full border px-4 py-2 text-sm font-semibold bg-(--primary) text-white hover:bg-(--primary-hover)"
              >
              Mes contacts
              </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            Vos dernières conversations :
          </p>
        </div>
      {/* <h1 className="text-xl font-semibold">Messages</h1> */}

      <ul className="mt-6 space-y-5">
        {inbox.map((conv) => (
          <li key={conv.conversationId}>
            <Link
              href={`/messages/${conv.conversationId}`}
              className="group flex items-center gap-4 rounded-2xl  bg-white px-4 py-3 shadow-md ring-1 ring-black/5 transition
                 hover:bg-white/90 hover:shadow-2xl active:scale-[0.98]"
            >
              <div className="shrink-0 h-12 w-12">
                <Avatar
                  name={conv.otherProfile.namePublic ?? "?"}
                  avatarUrl={conv.otherProfile.avatarUrl ?? null}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{conv.otherProfile.namePublic}</p>
                <p className="text-sm text-muted-foreground">
                  {max100carac(conv.lastMessage.content, 15)}
                </p>
              </div>
                <div className="shrink-0 text-xs text-muted-foreground">
                    {new Date(conv.lastMessage.createdAt).toLocaleDateString("fr-FR", {
                      hour:"2-digit", minute:"2-digit"
                    })}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
  }
  