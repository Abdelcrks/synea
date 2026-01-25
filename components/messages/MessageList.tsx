


type Message = {
    id: number
    content: string,
    senderId: string,
    createdAt: Date | null
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
        <div className="space-y-3">
            {messages.map((sms) => {
                const isMine = sms.senderId === currentUserId
                return(
                    <div key={sms.id}>
                        <p className="text-sm"> {sms.content}</p>
                        <p className="mt-1 text-xs opacity-70">{sms.createdAt?.toLocaleString?.()}</p>
                    </div>
                )
            })}
        </div>
    )
}