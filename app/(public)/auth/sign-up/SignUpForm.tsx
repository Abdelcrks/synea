"use client"

import { useActionState, useEffect, useState } from "react"
import { createAccountAction, type CreateAccountState } from "@/app/(public)/auth/sign-up/actions"
import { SubmitButton } from "../../onboarding/components/SubmitButton"
import { CancerType } from "@/lib/db/schema"
import { CANCER_LABELS } from "@/lib/constants/cancer"
import Link from "next/link"

export type Role = "hero" | "peer_hero"
export type RoleOrEmpty = Role | ""

export const SignUpForm = ({ defaultRole, cancerTypes }: { defaultRole: RoleOrEmpty, cancerTypes: readonly string[] }) => {
  const [namePublic, setNamePublic] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [cancerType, setCancerType] = useState<string>("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [state, formAction] = useActionState<CreateAccountState | null, FormData>(createAccountAction, null)
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
    <div className="min-h-[calc(100vh-4rem)] px-4 py-10 flex items-center justify-center bg-(--bg-main)">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl text-(--text-main)">
              Créer un compte
            </h1>
            <p className="mt-2 text-sm text-(--text-muted)">
              Rejoins SYNEA et configure ton profil en 1 minute.
            </p>
          </div>

          {state?.ok === false && !state.field && (
            <div className="mb-4 rounded-lg border border-(--destructive) bg-red-50 px-4 py-3 text-sm text-(--destructive)">
              {state.message}
            </div>
          )}

          <form action={formAction} className="flex flex-col gap-4">
            <div className="text-left">
              <label htmlFor="role" className="label">
                Tu es…
              </label>
              <select
                name="role"
                id="role"
                required
                value={role}
                onChange={(event) => setRole(event.target.value as RoleOrEmpty)}
                className="input"
              >
                <option value="">Choisir</option>
                <option value="hero">Héros (je traverse l’épreuve)</option>
                <option value="peer_hero">Pair-héros (j’ai déjà traversé l’épreuve)</option>
              </select>
              {state?.ok === false && state.field === "role" && (
                <p className="error">{state.message}</p>
              )}
            </div>

            <div className="text-left">
              <label htmlFor="namePublic" className="label">
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
                className="input"
              />
              {state?.ok === false && state.field === "namePublic" && (
                <p className="error">{state.message}</p>
              )}
            </div>

            <div className="text-left">
              <label htmlFor="email" className="label">
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
                className="input"
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
                required
                name="password"
                id="password"
                placeholder="luciole123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
              />
              {state?.ok === false && state.field === "password" && (
                <p className="error">{state.message}</p>
              )}
              <p className="help">
                Astuce : utilise au moins 8 caractères.
              </p>
            </div>

            <div className="text-left">
              <label htmlFor="cancerType" className="label">
                Type de cancer (optionnel)
              </label>
              <select
                name="cancerType"
                id="cancerType"
                value={cancerType}
                onChange={(e) => setCancerType(e.target.value)}
                className="input"
              >
                <option value="">Je ne souhaite pas répondre</option>
                {cancerTypes.map((type) => (
                  <option value={type} key={type}>
                    {CANCER_LABELS[type as CancerType]}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-left">
              <label className="flex items-start gap-3 rounded-lg border border-(--border bg-(--bg-card) px-4 py-3">
                <input
                  id="acceptedTerms"
                  name="acceptedTerms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-(--primary)"
                />
                <span className="text-sm text-(--text-main)">
                  J’accepte les CGU
                </span>
              </label>
              {state?.ok === false && state.field === "acceptedTerms" && (
                <p className="error">{state.message}</p>
              )}
            </div>

            <div className="pt-2">
              <SubmitButton
                disabled={!canSubmit}
                label="Créer mon compte"
                pendingLabel="Création..."
              />
              <p className="help text-center">
                Tu pourras modifier ces infos plus tard.
              </p>
            </div>
          </form>

          <div className="mt-3 text-center text-sm">
            <Link href={"/auth/sign-in"} className="link">
              Déjà inscrit ? par ici
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}