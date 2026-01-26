import { sendMessage } from "@/lib/actions/messages/SendMessage"


type SendMessageFormProps = {
    conversationId : number
}

export const SendMessageForm = ({conversationId} : SendMessageFormProps) => {
    return(
        <form action={sendMessage} className="mt-4 flex gap-2 min-w-0">
            <input type="hidden"  name="conversationId" value={String(conversationId)}/>

            <input type="text" placeholder="Écrire un message.." name="content"
            className="flex-1 min-w-0  rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2"
            />

            <button type="submit" className="shrink-0 rounded-xl px-4 py-3 text-sm font-semibold text-white btn-primary">
                Envoyer
            </button>
        </form>
    )
}