import Link from "next/link"



type Message = {
    id: number
    content: string,
    senderId: string,
    createdAt: Date | null

    senderNamePublic : string | null
    senderAvatarUrl: string | null
    senderProfileId: string | null
}

type MessageListProps = {
    messages: Message[]
    currentUserId: string
}

export function MessageList ({messages, currentUserId}: MessageListProps) {
    if(messages.length === 0){
        return(
            <p className="text-sm">Aucun message pour l'instant</p>
        )
    }
    
    return(
        <div className="mt-4 space-y-2 ">
            {messages.map((sms) => {
                const isMine = sms.senderId === currentUserId
                return(
                    <div key={sms.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                        <div className={["max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm",
                            isMine ? "bg-white text-white" : "bg-white text-(--text-main)",].join(" ")}>
                                {!isMine && (
                                    <div className="mb-1 text-xs font-semibold  opacity-80">
                                        {sms.senderProfileId ?(
                                            <Link href={`/profiles/${sms.senderProfileId}`}
                                            className="hover:underline focus:outline-none focus:ring-2 focus:ring-(--primary)/50 rounded">
                                                {sms.senderNamePublic ?? "Utilisateur"}
                                            </Link>
                                        ) : (
                                            <span>{sms.senderNamePublic ?? "Utilisateur"}</span>
                                        )}
                                    </div>
                                )}
                                <p className="text-sm leading-relaxed  whitespace-pre-wrap wrap-break-words break-all">
                                    {sms.content}
                                </p>
                                <p className="mt-1 text-xs opacity-70">
                                    {sms.createdAt?.toLocaleString?.()}
                                </p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}