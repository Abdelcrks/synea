import Link from "next/link"

type Message = {
  id: number
  content: string
  senderId: string
  createdAt: Date | null
  senderNamePublic: string | null
  senderAvatarUrl: string | null
  senderProfileId: string | null
}

type MessageListProps = {
  messages: Message[]
  currentUserId: string
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  if (messages.length === 0) {
    return <p className="text-sm muted">Aucun message pour l'instant</p>
  }

  return (
    <div className="space-y-5">
      {messages.map((sms) => {
        const isMine = sms.senderId === currentUserId

        return (
          <div key={sms.id} className={`flex min-w-0 ${isMine ? "justify-end" : "justify-start"}`}>
            <div className="min-w-0 max-w-[92%] sm:max-w-[75%] lg:max-w-[60%]">
              {!isMine && (
                <div className="mb-1 text-xs font-semibold muted">
                  {sms.senderProfileId ? (
                    <Link
                      href={`/profiles/${sms.senderProfileId}`}
                      className="link"
                    >
                      {sms.senderNamePublic ?? "Utilisateur"}
                    </Link>
                  ) : (
                    <span>{sms.senderNamePublic ?? "Utilisateur"}</span>
                  )}
                </div>
              )}

              <div
                className={[
                  "rounded-2xl px-4 py-3 text-sm ring-1 ring-black/5 shadow-sm",
                  isMine ? "bg-white/70" : "bg-white",
                ].join(" ")}
              >
                <p className="whitespace-pre-wrap wrap-break-word leading-relaxed">
                  {sms.content}
                </p>
              </div>

              <p className={`mt-1 text-xs muted ${isMine ? "text-right" : "text-left"}`}>
                {sms.createdAt?.toLocaleString?.()}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}