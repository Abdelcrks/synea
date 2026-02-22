"use client"

import { useActionState, useState } from "react"
import { signInAction, type SignInState } from "./actions"
import { SubmitButton } from "../../onboarding/components/SubmitButton"
import Link from "next/link"

export const SignInForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [state, formAction] = useActionState<SignInState | null, FormData>(
    signInAction,
    null
  )

  const canSubmit = email.includes("@") && password.length >= 8

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-10 flex items-center justify-center bg-(--bg-main)">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl text-(--text-main)">
              Connexion
            </h1>
            <p className="mt-2 text-sm text-(--text-muted)">
              Accède à ton espace en quelques secondes.
            </p>
          </div>

          {state?.ok === false && !state.field && (
            <div className="mb-4 rounded-lg border border-(--destructive) bg-red-50 px-4 py-3 text-sm text-(--destructive)">
              {state.message}
            </div>
          )}

          <form action={formAction} className="flex flex-col gap-4">
            <div className="text-left">
              <label htmlFor="email" className="label">
                Adresse email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="bla@mail.com"
                required
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {state?.ok === false && state.field === "email" && (
                <p className="error">{state.message}</p>
              )}
            </div>

            <div className="text-left">
              <label htmlFor="password" className="label">
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Ton mot de passe"
                required
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {state?.ok === false && state.field === "password" && (
                <p className="error">{state.message}</p>
              )}
            </div>

            <div className="pt-2 flex flex-col">
              <SubmitButton
                disabled={!canSubmit}
                label="Se connecter"
                pendingLabel="Connexion..."
              />
              <p className="mt-3 text-center text-xs text-(--text-muted)">
                En continuant, tu acceptes nos conditions d’utilisation.
              </p>
            </div>
          </form>

          <div className="mt-6 flex items-center justify-center gap-3 text-sm">
            <Link
              href={"/auth/sign-up"}
              className="link"
            >
              Pas encore inscrit ? par ici
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}