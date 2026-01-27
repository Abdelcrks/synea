"use client"
import { useActionState, useEffect, useRef } from "react"
import { updateEmailAction, updatePasswordAction } from "./SettingsAction"
import Link from "next/link"


export default function EditSettingsForm() {
    const [emailState, emailFormAction, emailPending] = useActionState(updateEmailAction, null)
    const [passwordState, passwordFormAction, passwordPending] = useActionState(updatePasswordAction, null)

    const emailFormRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        if (emailState?.ok) {
            emailFormRef.current?.reset()
        }
    }, [emailState?.ok])

    const passwordFormRef = useRef<HTMLFormElement>(null)
    useEffect(() => {
        if (passwordState?.ok) {
            passwordFormRef.current?.reset()
        }

    }, [passwordState?.ok])




    return (
        <main className="relative min-h-screen px-4 py-10 sm:px-10">
            <Link
                href={"/profile"}
                className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur px-3 py-1 text-sm font-medium text-[#6D647A] shadow-sm hover:text-[#483C5C] transition"
            >
                ← Retour
            </Link>

            <div className="mx-auto max-w-md space-y-10 pt-10">
                <section
                    id="email"
                    className="rounded-2xl border border-none  bg-white/60 p-6 text-center shadow-lg"
                >
                    <h2 className="font-semibold">Adresse email</h2>
                    <p className="text-sm">
                        Modifier l’adresse email associée à votre compte
                    </p>

                    <form ref={emailFormRef} action={emailFormAction} className="mt-6 space-y-6">
                        {emailState?.ok && (
                            <p className="text-sm text-green-600!">
                                Lien de confirmation généré (dev : voir le terminal).
                            </p>
                        )}

                        {!emailState?.ok && emailState?.message && !emailState.field && (
                            <p className="text-sm text-red-600!">{emailState.message}</p>
                        )}

                        <div className="text-left">
                            <label htmlFor="newEmail" className="text-sm font-medium">
                                Nouvel email
                            </label>
                            <input
                                type="email"
                                id="newEmail"
                                name="newEmail"
                                className="mt-1 w-full rounded-xl border px-4 py-2 outline-none focus:ring-2 focus:ring-[#9F86C0]/40"
                            />
                            {!emailState?.ok && emailState?.field === "newEmail" && (
                                <p className="mt-1 text-sm text-red-600!">{emailState.message}</p>
                            )}
                        </div>

                        <button
                            disabled={emailPending}
                            type="submit"
                            className="inline-flex w-full cursor-pointer items-center justify-center rounded-full border px-6 py-3 text-sm font-semibold text-white bg-(--primary)  disabled:opacity-60"
                        >
                            Enregistrer
                        </button>
                    </form>
                </section>

                <section
                    id="password"
                    className="rounded-2xl border border-none bg-white/60 p-6 text-center shadow-lg"
                >
                    <h2 className="font-semibold">Mot de passe</h2>
                    <p className="text-sm">Modifier votre mot de passe</p>

                    <form
                        ref={passwordFormRef}
                        action={passwordFormAction}
                        className="mt-6 space-y-6"
                    >
                        {passwordState?.ok && (
                            <p className="text-sm text-green-600!">Mot de passe modifié</p>
                        )}

                        <div className="space-y-4 text-left">
                            <div>
                                <label htmlFor="oldPasswordForPassword" className="text-sm font-medium">
                                    Mot de passe actuel
                                </label>
                                <input
                                    type="password"
                                    id="oldPasswordForPassword"
                                    name="currentPassword"
                                    className="mt-1 w-full rounded-xl border px-4 py-2 outline-none focus:ring-2 focus:ring-[#9F86C0]/40"
                                />
                                {!passwordState?.ok && passwordState?.field === "currentPassword" && (
                                    <p className="mt-1 text-sm text-red-600!">{passwordState.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="newPassword" className="text-sm font-medium">
                                    Nouveau mot de passe
                                </label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    className="mt-1 w-full rounded-xl border px-4 py-2 outline-none focus:ring-2 focus:ring-[#9F86C0]/40"
                                />
                                {!passwordState?.ok && passwordState?.field === "newPassword" && (
                                    <p className="mt-1 text-sm text-red-600!">{passwordState.message}</p>
                                )}
                            </div>
                        </div>

                        <button
                            disabled={passwordPending}
                            type="submit"
                            className="inline-flex cursor-pointer  w-full items-center justify-center rounded-full border px-6 py-3 text-sm font-semibold text-white bg-(--primary)  disabled:opacity-60"
                        >
                            Enregistrer
                        </button>
                    </form>
                </section>
            </div>
        </main>

    )
}


