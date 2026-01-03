"use client"

import { useActionState, useState } from "react"
import { createAccountAction, type CreateAccountState } from "./actions" // import du type
import { SubmitButton } from "./SubmitButton"


type Role = "hero" | "peer_hero"

export const SignUpForm = ({role}: {role: Role}) => {
    const [namePublic, setNamePublic] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [cancerType, setCancerType] = useState<string>("")  // si vide = non renseigné (rgpd) falcutatif
    const [acceptedTerms, setAcceptedTerms] = useState(false)
    const [state, formAction] = useActionState<CreateAccountState | null , FormData>(createAccountAction, null) // type importé cf l4


    const canSubmit = 
    namePublic.trim().length >= 2 &&
    email.includes("@") &&
    password.length >= 8 &&
    acceptedTerms;
    return (
        <div>
            <p className="text-xl font-bold">FORM VISIBLE TEST ✅</p>
            <form className="p-10 text-center flex flex-col gap-3" action={formAction}
            //  onSubmit={(e) => {
            //     e.preventDefault()
            //     if(!canSubmit) return

            //     console.log({role,namePublic,password,acceptedTerms,email, cancerType: cancerType || null})
            // }}
            >
                {state?.ok === false && !state.field  && (
                    <p className="text-red-600 text-sm">{state.message}</p>
                )}
                <input type="hidden" name="role" value={role} />

                <label htmlFor="namePublic">Prénom /pseudo</label>
                <input type="text" required name="namePublic" id="namePublic" className="bg-gray-300 rounded-md border px-3 py-2" placeholder="toto" value={namePublic} onChange={(e) => setNamePublic(e.target.value)}/>
                    {state?.ok == false && state.field === "namePublic" && (
                        <p className="text-sm text-red-600">{state.message}</p>
                    )}

                <label htmlFor="email">adresse email</label>
                <input type="email" required name="email" id="email" className="bg-gray-300 rounded-md border px-3 py-2" placeholder="adresse@mail.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    {state?.ok === false && state.field === "email" && (
                    <p className="text-sm text-red-600">{state.message}</p>
                    )}

                
                <label htmlFor="password"> mot de passe</label>
                <input type="password" required name="password" id="password" className="bg-gray-300 rounded-md border px-3 py-2" placeholder="luciole123" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    {state?.ok === false && state.field === "password" && (
                        <p className="text-sm text-red-600">{state.message}</p>
                    )}

                <label htmlFor="cancerType">Selectionne le type de cancer (optionnel)</label>
                <select name="cancerType" id="cancerType" value={cancerType} onChange={(e) => setCancerType(e.target.value)} className="rounded-md border px-3 py-2">
                    <option value="">Je ne souhaite pas répondre</option>
                    <option value="blood">Cancer du sang</option>
                    <option value="bone">Cancer des os</option>
                    <option value="breast">Cancer du sein</option>
                    <option value="lung">Cancer du poumon</option>
                    <option value="other">Autre</option>
                </select>
                
                <label className="flex items-center justify-center gap-2">
                <input
                    id="acceptedTerms"
                    name="acceptedTerms"
                    type="checkbox"
                    className="rounded-md border px-3 py-2"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                <span>J’accepte les CGU</span>
                </label>
                    {state?.ok == false && state.field === "acceptedTerms" && (
                        <p className="text-sm text-red-600">{state.message}</p>
                    )}

                {/* <button type="submit" disabled={!canSubmit} className={`rounded-full py-3 text-white ${
                    canSubmit ? "bg-black" : "bg-black/40 cursor-not-allowed"
                    }`}
                    >
                        Créer mon compte
                </button> */}
                <SubmitButton disabled={!canSubmit}></SubmitButton>

            </form>
        </div>
    )
}