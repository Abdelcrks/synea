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
        <main className="fixed left-1/2 top-0 md:top-16 w-full h-100dvh max-w-3xl -translate-x-1/2 px-4 pb-20 pt-4 overflow-hidden">
            <div className="mb-4 space-y-2">
                <h1 className="text-xl font-semibold">Conversation</h1>

                <Link href="/messages" className="text-sm font-medium text-(--primary)">
                ← Retour
                </Link>
            </div>
            <section className="flex h-[calc(100dvh-185px)] min-h-0 flex-col rounded-2xl bg-white/60 backdrop-blur ring-1 ring-black/5">
                <div className="shrink-0 border-b border-gray-200 px-4 py-3">
                    <p className="text-xs text-muted-foreground">Historique des messages</p>
                </div>
                <div className="flex-1 overflow-y-auto  overscroll-contain px-4 py-4 min-h-0">
                    <MessageList messages={messages} currentUserId={session.user.id} />
                <div className="h-2"/>
                </div>
                <div className="shrink-0 border-t  border-gray-200 px-4 py-3 bg-white/70 backdrop-blur">
                {canSend ? (
                    <SendMessageForm conversationId={conversationId}/>
                ) : (
                    <div className="rounded-2xl bg-[#9F86C0]/10 px-4 py-3 text-sm text-gray-800 ring-1 ring-black/5">
                    Vous n’êtes plus en contact.  
                    L’historique de la conversation reste consultable.
                    </div>
                )}
                </div>
            </section>
        </main>
    )
  }  


