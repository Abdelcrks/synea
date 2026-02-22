"use client"
import { sendMessage } from "@/lib/actions/messages/SendMessage"
import { useState } from "react"

type SendMessageFormsProps = {
  conversationId: number
}

export const SendMessageForm = ({ conversationId }: SendMessageFormsProps) => {
  const [error, setError] = useState<string | null>(null)

  const action = async (formData: FormData) => {
    const response = await sendMessage(formData)
    if (!response.ok) {
      setError(response.message ?? "une erreur est survenue")
      return
    }

    setError(null)
    const inputReset = document.querySelector<HTMLInputElement>(`input[name="content"]`)
    if (inputReset) {
      inputReset.value = ""
      inputReset.focus()
    }
  }

  return (
    <div className="space-y-2">
      {error && <p className="error">{error}</p>}

      <form action={action} className="flex min-w-0 gap-2">
        <input type="hidden" name="conversationId" value={String(conversationId)} />

        <input
          type="text"
          name="content"
          placeholder="Écrire un message…"
          className="input flex-1 min-w-0 rounded-full"
        />

        <button type="submit" className="btn btn--primary shrink-0 rounded-full px-5">
          Envoyer
        </button>
      </form>
    </div>
  )
}