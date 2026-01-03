"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function roles () {
    const [role, setRole] = useState<string | null> (null)

    const router = useRouter()
    const isChoiceValid = role !== null


    console.log(role)
    
    return (
        <div>
            <form action="" className="m-10 flex flex-col gap-10 text-center">
            
            <input type="radio" required id="btn-heros" name="role" value={"hero"} onChange={(e) => {setRole(e.target.value)}}/>
            <label htmlFor="btn-heros">Je suis un héros</label>
            
            <input type="radio" required id="btn-pair-heros" name="role" value={"peer_hero"} onChange={(e) => {setRole(e.target.value)}}/>
            <label htmlFor="btn-pair-heros">Je suis un pair-héros</label>

            <p>Role choisi : {role}</p>

            <button type="button" className={`py-3 rounded-full text-white ${isChoiceValid ? "bg-black" : "cursor-not-allowed"}`} disabled={!isChoiceValid}
            onClick={() => {
                if (!role) return
                router.push(`/auth/sign-up/${role}`

                )}}>
                Suivant
            </button>
            </form>


        </div>
    )
}