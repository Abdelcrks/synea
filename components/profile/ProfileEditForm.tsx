"use client"

import { useActionState,  } from "react"
import type { Profile } from "@/lib/db/queries/profile"
import { updateProfileAction, UpdateProfileState, } from "@/app/profile/edit/updateProfileAction"




type ProfileEditFormProps = {
    profile: Profile,
}

export default function ProfileEditForm  ({profile}:ProfileEditFormProps)  {
    const [state, formAction] = useActionState<UpdateProfileState | null, FormData>(updateProfileAction, null)

    // const [namePublic, setNamePublic] = useState(profile.namePublic)
    // const [bio, setBio] = useState(profile.bio ?? "")
    // const [location, setLocation] = useState(profile.locationRegion ?? "")
    
    

    return(
        <section>
            <form action={formAction} className="space-y-6">
                {state?.ok === false && !state.field && (
                    <p className="text-sm text-red-600">{state.message}</p>
                )}
                <div>
                    <label htmlFor="namePublic">Nom/pseudo</label>
                    <input type="text"  required name="namePublic" id="namePublic" defaultValue={profile.namePublic}
                    className="mt-1 w-full rounded-xl border px-4 py-2"
                    />
                    {state?.ok === false && state.field ==="namePublic" && (
                        <p className="text-red-600 text-sm">{state.message}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="bio">Bio</label>
                    <textarea name="bio" id="bio" defaultValue={profile.bio ?? ""} 
                        className="mt-1 w-full rounded-xl border px-4 py-2">    
                    </textarea>
                    {state?.ok === false && state.field === "bio" && (
                        <p className="text-sm text-red-600">{state.message}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="locationRegion" className="block text-sm font-medium text-[#483C5C]">
                        Région
                    </label>
                    <input type="text" name="locationRegion" defaultValue={profile.locationRegion ?? ""}
                    className="mt-1 w-full rounded-xl border px-4 py-2"/>
                    {state?.ok === false && state.field === "locationRegion" && (
                        <p className="text-sm text-red-500">{state.message}</p>
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
    )
}