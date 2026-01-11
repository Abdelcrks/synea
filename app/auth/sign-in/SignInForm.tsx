"use client"

import { useActionState, useState } from "react"
import { signInAction, type SignInState } from "./actions"
import { SubmitButton } from "../sign-up/SubmitButton"

export const SignInForm = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [state, formAction] = useActionState<SignInState | null, FormData>(
        signInAction, null
    )

    const canSubmit = email.includes("@") && password.length >=8
    return(
        <div>
            <form action={formAction} className=" p-10 flex flex-col text-center gap-5 ">
                {state?.ok === false && !state.field &&(
                    <p className="text-red-600 text-sm">{state.message}</p>
                )}
                
                <label htmlFor="email">Adresse email</label>
                <input type="email" name="email" id="email"placeholder="bla@mail.com" 
                required className="bg-gray-300 rounded-md border px-3 py-2"
                value={email}
                onChange={(e)=>{setEmail(e.target.value)}}
                />
                {state?.ok === false && state.field === "email" &&(
                    <p className="text-red-600 text-sm">{state.message}</p>
                )}

                <label htmlFor="password">Mot de passe</label>
                <input type="password" name="password" id="password" placeholder="ton mot de passe" 
                className="bg-gray-300 rounded-md border px-3 py-2" required
                value={password}
                onChange={(e)=> {setPassword(e.target.value)}}
                />
                {state?.ok === false && state.field === "password" &&(
                    <p className="text-red-600 text-sm"> {state.message}</p>
                )}

                <SubmitButton disabled={!canSubmit}></SubmitButton>
            </form>
        </div>
    )
}