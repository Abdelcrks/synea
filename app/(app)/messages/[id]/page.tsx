import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { getMessagesByConversationId, isUserConversationParticipant } from "@/lib/db/queries/messages"
import { MessageList } from "@/components/messages/MessageList"
import { SendMessageForm } from "@/components/messages/SendMessageForm"






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


    return (
        <main className="mx-auto w-full max-w-3xl px-4 pb-20 pt-4">
            <div className="p-4">
                <h1 className="text-xl font-semibold">Conversation {id}</h1>
                <h2 className="text-lg">Page en cours de construction.</h2>
                <MessageList messages={messages} currentUserId={session.user.id}></MessageList>
                <SendMessageForm conversationId={conversationId}></SendMessageForm>
            </div>
        </main>

    )
  }  


