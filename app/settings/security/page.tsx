"use client"
import { useActionState, useEffect, useRef } from "react"
import { updateEmailAction, updatePasswordAction } from "./SettingsAction"


export default function EditSettingsForm () {
    const [emailState, emailFormAction, emailPending] = useActionState(updateEmailAction, null)
    const [passwordState, passwordFormAction, passwordPending] = useActionState(updatePasswordAction,null)

    const emailFormRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        if(emailState?.ok){
            emailFormRef.current?.reset()
        }
    },[emailState?.ok])

    const passwordFormRef = useRef<HTMLFormElement>(null)
    useEffect(() => {
        if(passwordState?.ok){
            passwordFormRef.current?.reset()
        }
    }, [passwordState?.ok])


    

    return(
        <main>
            <section id="email" className="text-center pt-10 px-10">
                <h2 className="font-semibold">Adresse email</h2>
                <p className="text-sm">
                Modifier l’adresse email associée à votre compte
                </p>
                <form ref={emailFormRef} action={emailFormAction} className="space-y-6  ">
                    {emailState?.ok && (
                        <p className="text-green-600 text-sm">Lien de confirmation généré voir le terminal (console).</p>
                    )}
                    {!emailState?.ok && emailState?.message && !emailState.field && (
                        <p className="text-red-600 text-sm">{emailState.message}</p>
                    )}
                    <div className="flex flex-col">
                        <label htmlFor="newEmail">Change ton email</label>
                        <input type="email" id="newEmail" name="newEmail" className="mt-1 w-full rounded-xl border px-4 py-2"></input>
                        {!emailState?.ok && emailState?.field === "newEmail" && (
                            <p className="text-red-600 text-sm">{emailState.message}</p>
                        )}
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
                <form ref={passwordFormRef} action={passwordFormAction} className="space-y-6 ">
                        {passwordState?.ok &&(
                            <p className="text-sm text-green-600">Mot de passe modifié </p>
                        )} 
                    <div className="flex flex-col gap-2">
                        <label htmlFor="oldPasswordForPassword">mot de passe actuel</label>
                        <input type="password" id="oldPasswordForPassword" name="currentPassword" className="mt-1 w-full rounded-xl border px-4 py-2"/>
                        {!passwordState?.ok && passwordState?.field === "currentPassword" && (
                            <p className="text-sm text-red-600">{passwordState.message}</p>
                        )}
                        <label htmlFor="newPassword">nouveau mot de passe</label>
                        <input type="password" id="newPassword" name="newPassword" className="mt-1 w-full rounded-xl border px-4 py-2"/>
                        {!passwordState?.ok && passwordState?.field === "newPassword" && (
                            <p className="text-red-600 text-sm">{passwordState.message}</p>
                        )}
                    </div>
                    <div>
                        <button disabled={passwordPending} type="submit" className="inline-flex w-full items-center justify-center cursor-pointer rounded-full border  px-6 py-3 text-sm font-semibold text-white bg-[#9F86C0]"
                        >
                        Enregistrer
                        </button>
                    </div>
                </form>
            </section>
        </main>
    )
}