"use client"
import { useActionState } from "react"
import { updateEmailAction, updatePasswordAction } from "./SettingsAction"


export default function EditSettingsForm () {
    const [state, formAction] = useActionState(updateEmailAction, null)
    

    return(
        <main>
            <section id="email" className="text-center pt-10 px-10">
                <h2 className="font-semibold">Adresse email</h2>
                <p className="text-sm">
                Modifier l’adresse email associée à votre compte
                </p>
                <form action={formAction} className="space-y-6  ">
                    {state?.ok && (
                        <p className="text-green-600 text-sm">Un email de confirmation vous a été envoyé.</p>
                    )}
                    <div className="flex flex-col">
                        <label htmlFor="newEmail">Change ton email</label>
                        {!state?.ok && state?.message && (
                        <p className="text-red-600 text-sm">{state.message}</p>
                        )}
                        <input type="email" id="newEmail" name="newEmail" className="mt-1 w-full rounded-xl border px-4 py-2"></input>
                    </div>
                    <div>
                        <button type="submit" className="inline-flex w-full items-center justify-center cursor-pointer rounded-full border  px-6 py-3 text-sm font-semibold text-white bg-[#9F86C0]"
                        >
                        Enregistrer
                        </button>
                    </div>
                </form>
            </section>
            <section id="password" className="text-center px-10">
                <h2 className="font-semibold">Mot de passe</h2>
                <p className="text-sm">
                Modifier votre mot de passe
                </p>
                <form action={updatePasswordAction} className="space-y-6 ">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="oldPasswordForPassword">mot de passe actuel</label>
                        <input type="password" id="oldPasswordForPassword" name="currentPassword" className="mt-1 w-full rounded-xl border px-4 py-2"/>

                        <label htmlFor="newPassword">nouveau mot de passe</label>
                        <input type="password" id="newPassword" name="newPassword" className="mt-1 w-full rounded-xl border px-4 py-2"/>
                    </div>
                    <div>
                        <button type="submit" className="inline-flex w-full items-center justify-center cursor-pointer rounded-full border  px-6 py-3 text-sm font-semibold text-white bg-[#9F86C0]"
                        >
                        Enregistrer
                        </button>
                    </div>
                </form>
            </section>
        </main>
    )
}