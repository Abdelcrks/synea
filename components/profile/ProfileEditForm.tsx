"use client"

import { useActionState } from "react"
import type { Profile } from "@/lib/db/queries/profile"
import { updateProfileAction, UpdateProfileState } from "@/app/(app)/profile/edit/updateProfileAction"
import { CANCER_LABELS } from "@/lib/constants/cancer"
import { CANCER_TYPES, ROLES } from "@/lib/db/schema"
import { ROLE_LABELS } from "@/lib/constants/roles"
import Link from "next/link"

type ProfileEditFormProps = {
    profile: Profile,
}

export default function ProfileEditForm({ profile }: ProfileEditFormProps) {
    const [state, formAction] = useActionState<UpdateProfileState | null, FormData>(updateProfileAction, null)

    const roleWithoutAdmin = ROLES.filter((role) => role !== "admin")

    return (
        <div className="container-page">
            <Link href={"/profile"} 
            className="link-retour absolute top-1"
            // className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur px-3 py-1 text-sm font-medium text-[#6D647A] shadow-sm hover:text-[#483C5C] transition"
            >
                ← Retour
            </Link>
            <h1 className="text-3xl mb-5 font-bold ">
                Modifier mon profil
            </h1>
            <section className="card card--outline">
                <form action={formAction} className="stack">
                    {state?.ok === false && !state.field && (
                        <p className="error">{state.message}</p>
                    )}
                    <div className="stack-mobile">
                        <label htmlFor="namePublic" className="label">Nom/pseudo</label>
                        <input
                            type="text"
                            required
                            name="namePublic"
                            id="namePublic"
                            defaultValue={profile.namePublic}
                            className={`input ${state?.ok === false && state.field === "namePublic" ? "input--error" : ""}`}
                        />
                        {state?.ok === false && state.field === "namePublic" && (
                            <p className="error">{state.message}</p>
                        )}
                    </div>
                    <div className="stack-mobile">
                        <label htmlFor="bio" className="label">Bio</label>
                        <textarea
                            name="bio"
                            id="bio"
                            defaultValue={profile.bio ?? ""}
                            className={`input ${state?.ok === false && state.field === "bio" ? "input--error" : ""}`}
                            rows={5}
                            
                        />
                        {state?.ok === false && state.field === "bio" && (
                            <p className="error">{state.message}</p>
                        )}
                    </div>
                    <div className="stack-mobile">
                        <label htmlFor="locationRegion" className="label">Région</label>
                        <input
                            type="text"
                            name="locationRegion"
                            defaultValue={profile.locationRegion ?? ""}
                            className={`input ${state?.ok === false && state.field === "locationRegion" ? "input--error" : ""}`}
                        />
                        {state?.ok === false && state.field === "locationRegion" && (
                            <p className="error">{state.message}</p>
                        )}
                    </div>
                    <div className="stack-mobile">
                        <label htmlFor="role" className="label">Rôle</label>
                        <select
                            name="role"
                            id="role"
                            defaultValue={profile.role}
                            className="input"
                        >
                            {roleWithoutAdmin.map((role) => (
                                <option value={role} key={role}>{ROLE_LABELS[role]}</option>
                            ))}
                        </select>
                        <p className="help">
                            Vous pouvez changer votre rôle à tout moment. Le matching utilise ce choix.
                        </p>
                    </div>
                    <div className="stack-mobile">
                        <label htmlFor="cancerType" className="label">Type de cancer (facultatifs)</label>
                        <select
                            name="cancerType"
                            id="cancerType"
                            defaultValue={profile.cancerType ?? ""}
                            className="input"
                        >
                            <option value="">Je ne souhaite pas répondre</option>
                            {CANCER_TYPES.map((type) => (
                                <option key={type} value={type}>{CANCER_LABELS[type]}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="btn btn--primary w-full"
                        >
                            Enregistrer
                        </button>
                    </div>
                </form>
            </section>
        </div>
    )
}