"use client"
import { useActionState, useEffect, useRef } from "react"
import { updateEmailAction, updatePasswordAction } from "./SettingsAction"
import { disableAccountAction } from "@/lib/actions/account/disableAccountAction"
import { Modal } from "@/components/widgets/Modal"
import Link from "next/link"
import { deleteAccountNowAction } from "@/lib/actions/account/deleteAccountNowAction"

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
        <main className="container-page">
            <div className="mb-10">
            <Link
                href={"/profile"}
                className="link-retour "
            >
                ← Retour
            </Link>
            </div>
            <div>
                <h1 className="text-xl sm:text-xl lg:text-3xl mb-5 font-bold">Modifier vos informations personnelles</h1>
            </div>


            <div className="stack  ">
                <section id="email" className="card flex flex-col gap-5">
                    <h2 className="font-semibold  mb-2">Adresse email</h2>

                    <form ref={emailFormRef} action={emailFormAction} className="stack">
                        {emailState?.ok && (
                            <p className="text-sm muted">
                                Lien de confirmation généré (dev : voir le terminal).
                            </p>
                        )}

                        {!emailState?.ok && emailState?.message && !emailState.field && (
                            <p className="error">{emailState.message}</p>
                        )}

                        <div className="stack">
                            <label htmlFor="newEmail" className="label">
                            Modifier l’adresse email associée à votre compte
                            </label>
                            <input
                                type="email"
                                id="newEmail"
                                name="newEmail"
                                className={`input mb-5 ${!emailState?.ok && emailState?.field === "newEmail" ? "input--error" : ""}`}
                            />
                            {!emailState?.ok && emailState?.field === "newEmail" && (
                                <p className="error">{emailState.message}</p>
                            )}
                        </div>

                        <button
                            disabled={emailPending}
                            type="submit"
                            className="btn btn--primary"
                        >
                            Enregistrer
                        </button>
                    </form>
                </section>

                <section id="password" className="card flex flex-col gap-5">
                    <h2 className="font-semibold">Mot de passe</h2>

                    <form ref={passwordFormRef} action={passwordFormAction} className="stack">
                        {passwordState?.ok && (
                            <p className="text-sm muted">Mot de passe modifié</p>
                        )}

                        <div className="stack">
                            <div>
                                <label htmlFor="oldPasswordForPassword" className="label">
                                    Mot de passe actuel
                                </label>
                                <input
                                    type="password"
                                    id="oldPasswordForPassword"
                                    name="currentPassword"
                                    className={`input ${!passwordState?.ok && passwordState?.field === "currentPassword" ? "input--error" : ""}`}
                                />
                                {!passwordState?.ok && passwordState?.field === "currentPassword" && (
                                    <p className="error">{passwordState.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="newPassword" className="label">
                                    Nouveau mot de passe
                                </label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    className={`input mb-5 ${!passwordState?.ok && passwordState?.field === "newPassword" ? "input--error" : ""}`}
                                />
                                {!passwordState?.ok && passwordState?.field === "newPassword" && (
                                    <p className="error">{passwordState.message}</p>
                                )}
                            </div>
                        </div>

                        <button
                            disabled={passwordPending}
                            type="submit"
                            className="btn btn--primary"
                        >
                            Enregistrer
                        </button>
                    </form>
                </section>
                <section className="card flex flex-col gap-5">
                    <h2 className="font-semibold">Compte</h2>

                    <div className="stack">
                        <Modal
                        triggerText="Désactiver mon compte"
                        title="Désactiver votre compte ?"
                        description="Vous serez déconnecté immédiatement. Vous pourrez le réactiver plus tard."
                        confirmText="Oui, désactiver"
                        triggerClassName="btn btn--secondary"
                        confirmClassName="btn btn--primary"
                        action={async () => {
                            await disableAccountAction()
                        }}
                        />

                        <Modal
                        triggerText="Supprimer mon compte"
                        title="Supprimer définitivement votre compte ?"
                        description="Votre compte sera d’abord désactivé puis supprimé automatiquement après 30 jours. Vous pouvez annuler pendant ce délai."
                        confirmText="Oui, demander la suppression"
                        triggerClassName="btn btn--secondary"
                        confirmClassName="btn btn--primary"
                        action={async () => {
                            await deleteAccountNowAction()
                        }}
                        />
                    </div>
                    </section>
                
            </div>
        </main>
    )
}


