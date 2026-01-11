"use client"

import { useActionState, useEffect, useState } from "react"
import { createAccountAction, type CreateAccountState } from "./actions" // import du type
import { SubmitButton } from "./SubmitButton"


type Role = "hero" | "peer_hero"
type RoleOrEmpty = Role | ""

export const SignUpForm = ({defaultRole, cancerTypes,}: {defaultRole: RoleOrEmpty, cancerTypes:readonly string[]}) => {
    const [namePublic, setNamePublic] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [cancerType, setCancerType] = useState<string>("")  // si vide = non renseigné (rgpd) falcutatif
    const [acceptedTerms, setAcceptedTerms] = useState(false)
    const [state, formAction] = useActionState<CreateAccountState | null , FormData>(createAccountAction, null) // type importé cf l4
    const [role, setRole] = useState<RoleOrEmpty>(defaultRole)


    const canSubmit = 
    role !== "" &&
    namePublic.trim().length >= 2 &&
    email.includes("@") &&
    password.length >= 8 &&
    acceptedTerms


    const CANCER_LABELS: Record<string, string> = {
        bone: "Cancer des os",
        breast: "Cancer du sein",
        lung: "Cancer du poumon",
        skin: "Cancer de la peau",
        brain: "Cancer du cerveau",
        digestive: "Cancer digestif",
        gynecologic: "Cancer gynécologique",
        urologic: "Cancer urologique",
        head_neck: "Cancer ORL (tête et cou)",
        leukemia: "Leucémie",
        lymphoma: "Lymphome",
        myeloma: "Myélome",
        sarcoma: "Sarcome",
        other: "Autre",
      };
      
      useEffect(() => {
        setRole(defaultRole)
      },[defaultRole]) 

    return (
        <div>
            {/* <p className="text-xl font-bold">FORM VISIBLE TEST ✅</p> */}
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

                <label htmlFor="role">Tu es ...</label>
                <select name="role" id="role" required value={role}
                onChange={(event) => setRole(event.target.value as RoleOrEmpty)}
                className="rounded-md border px-3 py-2"
                >
                    <option value="">Choisir</option>
                    <option value="hero">Héros (je traverse l'épreuve)</option>
                    <option value="peer_hero">Pair-heros (j'ai déjà traversé l'épreuve)</option>
                </select>
                {state?.ok === false && state.field === "role" && (
                    <p className="text-red-600 text-sm">{state.message}</p>
                )}


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
                    {cancerTypes.map((type) => (
                        <option value={type} key={type}>
                            {CANCER_LABELS[type]}
                        </option>
                    ))}
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