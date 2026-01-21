"use client"

import { useActionState, useEffect, useState } from "react"
import { createAccountAction, type CreateAccountState } from "@/app/(public)/auth/sign-up/actions"
import { SubmitButton } from "../../onboarding/components/SubmitButton"
import { CancerType } from "@/lib/db/schema"
import { CANCER_LABELS } from "@/lib/constants/cancer"
import Link from "next/link"


export type Role = "hero" | "peer_hero"
export type RoleOrEmpty = Role | ""

// export const CANCER_LABELS: Record<CancerType, string> = {
//         bone: "Cancer des os",
//         breast: "Cancer du sein",
//         lung: "Cancer du poumon",
//         skin: "Cancer de la peau",
//         brain: "Cancer du cerveau",
//         digestive: "Cancer digestif",
//         gynecologic: "Cancer gynécologique",
//         urologic: "Cancer urologique",
//         head_neck: "Cancer ORL (tête et cou)",
//         leukemia: "Leucémie",
//         lymphoma: "Lymphome",
//         myeloma: "Myélome",
//         sarcoma: "Sarcome",
//         other: "Autre",
//       }


export const SignUpForm = ({ defaultRole, cancerTypes, }: { defaultRole: RoleOrEmpty, cancerTypes: readonly string[] }) => {
    const [namePublic, setNamePublic] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [cancerType, setCancerType] = useState<string>("")  // si vide = non renseigné (rgpd) falcutatif
    const [acceptedTerms, setAcceptedTerms] = useState(false)
    const [state, formAction] = useActionState<CreateAccountState | null, FormData>(createAccountAction, null) // type importé cf l4
    const [role, setRole] = useState<RoleOrEmpty>(defaultRole)


    const canSubmit =
        role !== "" &&
        namePublic.trim().length >= 2 &&
        email.includes("@") &&
        password.length >= 8 &&
        acceptedTerms






    useEffect(() => {
        setRole(defaultRole)
    }, [defaultRole])

    return (
        <div className="min-h-[calc(100vh-4rem)] px-4 py-10 flex items-center justify-center">
            <div className="w-full max-w-md">
                <div className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur p-6 shadow-sm sm:p-8">
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                            Créer un compte
                        </h1>
                        <p className="mt-2 text-sm text-black/70">
                            Rejoins SYNEA et configure ton profil en 1 minute.
                        </p>
                    </div>

                    {state?.ok === false && !state.field && (
                        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {state.message}
                        </div>
                    )}

                    <form action={formAction} className="flex flex-col gap-4">
                        {/* ROLE */}
                        <div className="text-left">
                            <label htmlFor="role" className="mb-1 block text-sm font-medium text-black/80">
                                Tu es…
                            </label>

                            <select
                                name="role"
                                id="role"
                                required
                                value={role}
                                onChange={(event) => setRole(event.target.value as RoleOrEmpty)}
                                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition
                       focus:ring-2 focus:ring-(--primary)] focus:border-transparent"
                            >
                                <option value="">Choisir</option>
                                <option value="hero">Héros (je traverse l’épreuve)</option>
                                <option value="peer_hero">Pair-héros (j’ai déjà traversé l’épreuve)</option>
                            </select>

                            {state?.ok === false && state.field === "role" && (
                                <p className="mt-2 text-sm text-red-600">{state.message}</p>
                            )}
                        </div>

                        {/* NAME */}
                        <div className="text-left">
                            <label htmlFor="namePublic" className="mb-1 block text-sm font-medium text-black/80">
                                Prénom / pseudo
                            </label>

                            <input
                                type="text"
                                required
                                name="namePublic"
                                id="namePublic"
                                placeholder="Toto"
                                value={namePublic}
                                onChange={(e) => setNamePublic(e.target.value)}
                                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition
                       focus:ring-2 focus:ring-(--primary)] focus:border-transparent"
                            />

                            {state?.ok === false && state.field === "namePublic" && (
                                <p className="mt-2 text-sm text-red-600">{state.message}</p>
                            )}
                        </div>

                        {/* EMAIL */}
                        <div className="text-left">
                            <label htmlFor="email" className="mb-1 block text-sm font-medium text-black/80">
                                Adresse email
                            </label>

                            <input
                                type="email"
                                required
                                name="email"
                                id="email"
                                placeholder="adresse@mail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition
                       focus:ring-2 focus:ring-(--primary)] focus:border-transparent"
                            />

                            {state?.ok === false && state.field === "email" && (
                                <p className="mt-2 text-sm text-red-600">{state.message}</p>
                            )}
                        </div>

                        {/* PASSWORD */}
                        <div className="text-left">
                            <label htmlFor="password" className="mb-1 block text-sm font-medium text-black/80">
                                Mot de passe
                            </label>

                            <input
                                type="password"
                                required
                                name="password"
                                id="password"
                                placeholder="luciole123"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition
                       focus:ring-2 focus:ring-(--primary)] focus:border-transparent"
                            />

                            {state?.ok === false && state.field === "password" && (
                                <p className="mt-2 text-sm text-red-600">{state.message}</p>
                            )}

                            <p className="mt-2 text-xs text-black/60">
                                Astuce : utilise au moins 8 caractères.
                            </p>
                        </div>

                        {/* CANCER TYPE (OPTIONAL) */}
                        <div className="text-left">
                            <label htmlFor="cancerType" className="mb-1 block text-sm font-medium text-black/80">
                                Type de cancer (optionnel)
                            </label>

                            <select
                                name="cancerType"
                                id="cancerType"
                                value={cancerType}
                                onChange={(e) => setCancerType(e.target.value)}
                                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition
                       focus:ring-2 focus:ring-(--primary)] focus:border-transparent"
                            >
                                <option value="">Je ne souhaite pas répondre</option>
                                {cancerTypes.map((type) => (
                                    <option value={type} key={type}>
                                        {CANCER_LABELS[type as CancerType]}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* TERMS */}
                        <div className="text-left">
                            <label className="flex items-start gap-3 rounded-xl border border-black/10 bg-white px-4 py-3">
                                <input
                                    id="acceptedTerms"
                                    name="acceptedTerms"
                                    type="checkbox"
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                    className="mt-1 h-4 w-4 accent-(--primary)]"
                                />
                                <span className="text-sm text-black/80">
                                    J’accepte les CGU
                                </span>
                            </label>

                            {state?.ok === false && state.field === "acceptedTerms" && (
                                <p className="mt-2 text-sm text-red-600">{state.message}</p>
                            )}
                        </div>

                        {/* CTA */}
                        <div className="pt-2">
                            <SubmitButton
                                disabled={!canSubmit}
                                label="Créer mon compte"
                                pendingLabel="Création..."
                            />
                            <p className="mt-3 text-center text-xs text-black/60">
                                Tu pourras modifier ces infos plus tard.
                            </p>
                        </div>
                    </form>
                    <div className="mt-3 text-center text-sm">
                        <Link href={"/auth/sign-in"} className=" p-2 rounded-full inline-flex cursor-pointer text-[#6D647A] hover:text-[#483C5C] transition">Déjà inscris ? par ici</Link>
                    </div>
                </div>
            </div>
        </div>

    )
}