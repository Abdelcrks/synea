import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { getMessagesByConversationId, getOtherUserId, isUserConversationParticipant } from "@/lib/db/queries/messages"
import { MessageList } from "@/components/messages/MessageList"
import { SendMessageForm } from "@/components/messages/SendMessageForm"
import Link from "next/link"
import { areUsersContacts } from "@/lib/db/queries/contacts"







type PageProps = {
    params: Promise<{ id: string }>
  }
  
  export default async function MessageDetailPage({ params }: PageProps) {
    const session = await auth.api.getSession({headers: await headers()})
    if(!session){
        redirect("/auth/sign-in")
    }

    const {id} = await params

    const conversationId = Number(id)
    if(!conversationId || Number.isNaN(conversationId)){
        redirect("/messages")
    }

    const isParticipant = await isUserConversationParticipant(conversationId, session.user.id)
    if(!isParticipant){
        redirect("/messages")
    }

    const messages = await getMessagesByConversationId(conversationId)

    const otherUserId = await getOtherUserId(conversationId, session.user.id)
    const canSend = otherUserId !== null && (await areUsersContacts(session.user.id, otherUserId))


    return (
            <main className="fixed inset-0 w-full md:top-16 md:bottom-0 md:inset-x-0 md:left-1/2 md:max-w-3xl md:-translate-x-1/2 overflow-hidden bg-transparent">
              <div className="h-full md:px-4 md:pt-4">
                <section
                  className="flex h-full flex-col md:rounded-2xl md:bg-white/60 md:backdrop-blur md:ring-1 md:ring-black/5" >
                  <div className="shrink-0 border-b border-gray-200 bg-white/70 backdrop-blur px-4 py-3 md:rounded-t-2xl">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Conversation</p>
                        <h1 className="truncate text-base font-semibold">Historique des messages</h1>
                      </div>
          
                      <Link href="/messages" className="shrink-0 text-sm font-medium text-(--primary)">
                        ← Retour
                      </Link>
                    </div>
                  </div>
          
                  <div
                    className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-4 pb-24 md:pb-4">
                    <MessageList messages={messages} currentUserId={session.user.id} />
                  </div>
    
                  <div className="shrink-0 border-t border-gray-200 bg-white/80 backdrop-blur px-4 py-3 pb-20 md:pb-3 md:rounded-b-2xl">
                    {canSend ? (
                      <SendMessageForm conversationId={conversationId} />
                    ) : (
                      <div className="rounded-2xl bg-[#9F86C0]/10 px-4 py-3 text-sm text-gray-800 ring-1 ring-black/5">
                        Vous n’êtes plus en contact. L’historique de la conversation reste consultable.
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </main>
    )
  }  


