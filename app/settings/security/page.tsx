"use client"
import { useState } from "react"


export default function EditSettingsForm () {
    const [passwordNow, setpasswordNow] = useState("")
    
    
    return(
        <main>
            <section id="email" className="text-center pt-10 px-10">
                <h2 className="font-semibold">Adresse email</h2>
                <p className="text-sm">
                Modifier l’adresse email associée à votre compte
                </p>
                <form action="" className="space-y-6  ">
                    <div className="flex flex-col">
                        <label htmlFor="oldpassword">mot de passe actuel</label>
                        <input type="password" id="password" name="oldpassword" className="mt-1 w-full rounded-xl border px-4 py-2"/>
                        <label htmlFor="email">Change ton email</label>
                        <input type="email" id="email" name="email" className="mt-1 w-full rounded-xl border px-4 py-2"></input>
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
                <form action="" className="space-y-6 ">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="oldpassword">mot de passe actuel</label>
                        <input type="password" id="password" name="oldpassword" className="mt-1 w-full rounded-xl border px-4 py-2"/>

                        <label htmlFor="password">nouveau mot de passe</label>
                        <input type="password" id="password" name="password" className="mt-1 w-full rounded-xl border px-4 py-2"/>
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