"use client"
import { sendMessage } from "@/lib/actions/messages/SendMessage"
import { useState } from "react"

type SendMessageFormsProps = {
    conversationId: number
}



export const SendMessageForm = ({conversationId}:SendMessageFormsProps ) => {
    const [error, setError] = useState<string | null> (null)

    const action = async (formData:FormData) => {
        const response = await sendMessage(formData)
        if(!response.ok){
            setError(response.message ?? "une erreur est survenue")
        }
            setError(null)
            const inputReset = document.querySelector<HTMLInputElement>(`input[name="content"]`)
            inputReset?.focus()
            inputReset && (inputReset.value == "")
        
    }


    return(
        <div>
            {error && (
                <p className="mb-2 text-sm text-red-600!">{error}</p>
            )}
            <form action={action} className="flex gap-2 min-w-0">
                <input type="hidden"  name="conversationId" value={String(conversationId)}/>

                <input type="text" placeholder="Écrire un message.." name="content"
                className="flex-1 min-w-0  rounded-full border border-gray-300  bg-white px-4 py-3 text-sm outline-none focus:ring-2"
                />

                <button type="submit" className="shrink-0 cursor-pointer rounded-xl px-5 py-3 text-sm font-semibold text-white btn-primary hover:bg-[#6f5493]">
                    Envoyer
                </button>
            </form>
        </div>
    )
}