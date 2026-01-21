"use client"

import { useActionState, useState } from "react"
import { signInAction, type SignInState } from "./actions"
import { SubmitButton } from "../../onboarding/components/SubmitButton"
import Link from "next/link"

export const SignInForm = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [state, formAction] = useActionState<SignInState | null, FormData>(
        signInAction, null
    )

    const canSubmit = email.includes("@") && password.length >= 8
    return (
        <div className="min-h-[calc(100vh-4rem)] px-4 py-10 flex items-center justify-center">
            <div className="w-full max-w-md">
                <div className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur p-6 shadow-sm sm:p-8">
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                            Connexion
                        </h1>
                        <p className="mt-2 text-sm text-black/70">
                            Accède à ton espace en quelques secondes.
                        </p>
                    </div>

                    {state?.ok === false && !state.field && (
                        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {state.message}
                        </div>
                    )}

                    <form action={formAction} className="flex flex-col gap-4">
                        <div className="text-left">
                            <label htmlFor="email" className="mb-1 block text-sm font-medium text-black/80">
                                Adresse email
                            </label>

                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="bla@mail.com"
                                required
                                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition
                       focus:ring-2 focus:ring-(--primary)] focus:border-transparent"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            {state?.ok === false && state.field === "email" && (
                                <p className="mt-2 text-sm text-red-600">{state.message}</p>
                            )}
                        </div>

                        <div className="text-left">
                            <label htmlFor="password" className="mb-1 block text-sm font-medium text-black/80">
                                Mot de passe
                            </label>

                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Ton mot de passe"
                                required
                                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition
                       focus:ring-2 focus:ring-(--primary)] focus:border-transparent"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            {state?.ok === false && state.field === "password" && (
                                <p className="mt-2 text-sm text-red-600">{state.message}</p>
                            )}
                        </div>

                        <div className="pt-2 flex flex-col">
                            <SubmitButton
                                disabled={!canSubmit}
                                label="Se connecter"
                                pendingLabel="Connexion..."
                            />
                            <p className="mt-3 text-center text-xs text-black/60">
                                En continuant, tu acceptes nos conditions d’utilisation.
                            </p>
                        </div>
                    </form>
                    <div className="mt-6 flex items-center justify-center gap-3 text-sm">
                        {/* <a href="/forgot-password" className="text-black/70 underline-offset-4 hover:underline">
                            Mot de passe oublié
                        </a> */}
                        <span className="text-black/20">•</span>
                        <Link href={"/auth/sign-up"} className="p-2 rounded-full inline-flex cursor-pointer text-[#6D647A] hover:text-[#483C5C] transition">Pas encore inscrit ? par ici</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}