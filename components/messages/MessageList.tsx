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
            <p className="text-sm text-muted-foreground">Aucun message pour l'instant</p>
        )
    }
    
    return(
        <div className="space-y-6">
            {messages.map((sms) => {
                const isMine = sms.senderId === currentUserId
                return(
                    <div key={sms.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                        <div className="max-w-[85%] sm:max-w-[70%]">
                                {!isMine && (
                                    <div className="mb-1 text-xs font-semibold  text-muted-foreground">
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
                                <div className={["rounded-2xl px-4 py-3 text-sm shadow-sm ring-1 ring-black/5",
                                isMine ? "bg-[#9F86C0]/15 text-gray-900" : "bg-white text-gray-900",
                                ].join(" ")}>
                                    <p className="text-sm leading-relaxed  whitespace-pre-wrap wrap-break-words break-all">
                                        {sms.content}
                                    </p> 
                                </div>

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