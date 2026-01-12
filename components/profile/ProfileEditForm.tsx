"use client"

import { useActionState,  } from "react"
import type { Profile } from "@/lib/db/queries/profile"
import { updateProfileAction, UpdateProfileState, } from "@/app/profile/edit/updateProfileAction"
import { CANCER_LABELS } from "@/lib/constants/cancer"
import { CANCER_TYPES, ROLES } from "@/lib/db/schema"
import { ROLE_LABELS } from "@/lib/constants/roles"
import type {Role} from "@/lib/db/schema"



type ProfileEditFormProps = {
    profile: Profile,
}

export default function ProfileEditForm  ({profile}:ProfileEditFormProps)  {
    const [state, formAction] = useActionState<UpdateProfileState | null, FormData>(updateProfileAction, null)

    // const [namePublic, setNamePublic] = useState(profile.namePublic)
    // const [bio, setBio] = useState(profile.bio ?? "")
    // const [location, setLocation] = useState(profile.locationRegion ?? "")

    const roleWithoutAdmin = ROLES.filter((role) => role !== "admin")

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
                    <label htmlFor="role">Rôle</label>
                    <select name="role" id="role" defaultValue={profile.role} className="mt-1 w-full rounded-xl border px-4 py-2">
                        {roleWithoutAdmin.map((role) => (
                            <option value={role} key={role}>{ROLE_LABELS[role]}</option>
                        ))}
                        
                    </select>
                    <p className="mt-2 text-xs text-[#6D647A] italic">
                        Vous pouvez changer votre rôle à tout moment. Le matching utilise ce choix.
                    </p>
                </div>
                <div>
                    <label htmlFor="cancerType">Type de cancer (facultatifs)</label>
                    <select name="cancerType" id="cancerType" defaultValue={profile.cancerType ?? ""} className="mt-1 w-full rounded-xl border px-4 py-2">
                        <option value="">Je ne souhaite pas répondre</option>
                        {CANCER_TYPES.map((type) =>(
                            <option key={type} value={type}>{CANCER_LABELS[type]}</option> // Cancer_type = db / cancer_labels en français 
                        ))}
                    </select>
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