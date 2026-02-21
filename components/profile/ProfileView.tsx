import { Profile } from "@/lib/db/queries/profile"
import Image from "next/image"
import Link from "next/link"
import { CANCER_LABELS } from "@/lib/constants/cancer"
import { ROLE_LABELS } from "@/lib/constants/roles"
import { signOutAction } from "@/lib/actions/auth/signOutAction"
import { AvatarEdit } from "./AvatarEdit"
import { Camera } from "lucide-react"

type ProfileViewProps = {
    profile: Profile | null,
    email: string 
}

export const ProfileView = ({profile,email}: ProfileViewProps) => {

    if (!profile) {
        return <p>Profil introuvable</p>
      }

    const memberSince = new Date(profile.createdAt).toLocaleDateString("fr-FR")
    return(
        <section className="mx-auto max-w-xl p-4 md:p-8 space-y-6 ">
            <div className="space-y-1">
                <div className="flex items-center justify-between gap-3">
                    <h1 className="text-2xl font-semibold">Mon profil</h1>

                    <Link
                    href="/contacts"
                    className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold bg-(--primary) hover:bg-(--primary-hover) text-white"
                    >
                    Mes contacts
                    </Link>
                </div>
                <p className="text-sm text-muted-foreground">
                    Complétez votre profil pour mieux échanger avec la communauté
                </p>
            </div>
            <div className="card">
                <AvatarEdit name={profile.namePublic} avatarUrl={profile.avatarUrl}></AvatarEdit>

                <h1 className="font-semibold text-3xl">{profile.namePublic}</h1>
                <span className="text-sm px-3 py-1 rounded-full bg-[#9F86C0]/30 text-[#6D647A] font-semibold">{ROLE_LABELS[profile.role]}</span>
                <p className="">{profile.locationRegion ?? "Région non renseignée"}</p>
                
                <Link href={`/profile/edit`} className="btn btn--primary w-full">Modifier mon profil</Link>
            </div>
            <div className="card card--outline">
                <h2 className="font-semibold">À propos</h2>
                <p>{profile.bio ?? "Aucune bio.."}</p>
            </div>
            <div className="card card--outline">
                <h2 className=" font-semibold">Informations (optionnel) </h2>
                <p className="">Type de cancer (optionnel) : {profile.cancerType ? CANCER_LABELS[profile.cancerType] : "Non renseigné"}</p>
                <p className="text-xs  italic">Ces informations sont facultatives. Vous choisissez ce que vous partagez.</p>
            </div>
            <div className="rounded-2xl shadow-xl bg-white p-4 space-y-2">
                <h2 className=" font-semibold">Compte</h2>
                <div className="flex items-center justify-between">
                    <p className="">Email : {email}</p>
                    <Link href={"/settings/security#email"} 
                    className="text-sm font-medium text-[#9F86C0] hover:text-(--primary-hover)">
                    Gérer
                    </Link>
                </div>
                <div className="flex justify-between items-center">
                    <p className="">Mot de passe : ••••••••</p>
                    <Link className="text-sm text-[#9F86C0] font-medium hover:text-(--primary-hover) "
                     href={"/settings/security#password"}>
                    Gérer
                    </Link>
                </div>
                <p className="">Membre depuis : {memberSince}</p>
                <div className="text-xs  italic">Vos informations ne sont jamais partagées à des fins commerciales.</div>
                <form action={signOutAction} className="pt-2">
                    <button className="w-full cursor-pointer rounded-full border text-white px-6 py-3 bg-(--primary) text-sm font-semibold hover:bg-(--primary-hover)">Se déconnecter</button>
                </form>
            </div>
            <div className="rounded-2xl shadow-xl bg-white p-4 space-y-2">
                <h2 className=" font-semibold">Préférences</h2>
                <p className="">Permettre aux Pair-héros de me contacter</p>
                <p className="">Afficher ma localisation aux autres</p>
            </div>
            <div className="rounded-2xl shadow-xl flex flex-col   bg-white p-4 space-y-2">
                <h2 className=" font-semibold">Zone sensible</h2>
                <p className="text-red-900 text-center">La suppression de votre compte est définitive. Toutes vos données , messages et relations seront supprimés de façon irreversible.</p>
                <button type="button" className="bg-red-600 w-full rounded-full px-6 py-3 text-sm font-semibold text-white hover:bg-red-800 cursor-pointer">Supprimer mon compte</button>
            </div>
        </section>
    )
}