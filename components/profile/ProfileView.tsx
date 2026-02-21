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
        <section className="container-page space-y-12">
            <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold">Mon profil</h1>
                    <Link href="/contacts" className="btn btn--primary">
                        Mes contacts
                    </Link>
                </div>
                <p className="text-sm muted">
                    Complétez votre profil pour mieux échanger avec la communauté
                </p>
            </div>
            <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-6">
                    <div className="card flex flex-col  text-center items-center">
                        <AvatarEdit name={profile.namePublic} avatarUrl={profile.avatarUrl}></AvatarEdit>
                        <h1 className="font-semibold text-3xl mt-4">{profile.namePublic}</h1>
                        <span className="text-sm px-3 py-1 rounded-full bg-(--primary-soft) text-(--text-muted) font-semibold">
                            {ROLE_LABELS[profile.role]}
                        </span>
                        <p className="mt-2">{profile.locationRegion ?? "Région non renseignée"}</p>
                        <Link href={`/profile/edit`} className="btn btn--primary w-full mt-4">
                            Modifier mon profil
                        </Link>
                    </div>
                    <div className="card card--outline">
                        <h2 className="font-semibold">À propos</h2>
                        <p className="mt-2">{profile.bio ?? "Aucune bio.."}</p>
                    </div>
                    <div className="card card--outline">
                        <h2 className="font-semibold">Informations (optionnel)</h2>
                        <p className="mt-2">Type de cancer (optionnel) : {profile.cancerType ? CANCER_LABELS[profile.cancerType] : "Non renseigné"}</p>
                        <p className="text-xs italic mt-2">Ces informations sont facultatives. Vous choisissez ce que vous partagez.</p>
                    </div>
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <div className="card">
                        <h2 className="font-semibold">Compte</h2>
                        <div className="flex items-center justify-between mt-4">
                            <p>Email : {email}</p>
                            <Link href={"/settings/security#email"} className="link">
                                Gérer
                            </Link>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                            <p>Mot de passe : ••••••••</p>
                            <Link href={"/settings/security#password"} className="link">
                                Gérer
                            </Link>
                        </div>
                        <p className="mt-4">Membre depuis : {memberSince}</p>
                        <p className="text-xs italic mt-2">Vos informations ne sont jamais partagées à des fins commerciales.</p>
                        <form action={signOutAction} className="pt-4">
                            <button className="btn btn--primary w-full">Se déconnecter</button>
                        </form>
                    </div>
                    <div className="card">
                        <h2 className="font-semibold">Préférences</h2>
                        <p className="mt-2">Permettre aux Pair-héros de me contacter</p>
                        <p className="mt-2">Afficher ma localisation aux autres</p>
                    </div>
                    <div className="card">
                        <h2 className="font-semibold">Zone sensible</h2>
                        <p className="text-(--destructive) text-center mt-4">
                            La suppression de votre compte est définitive. Toutes vos données, messages et relations seront supprimés de façon irréversible.
                        </p>
                        <button type="button" className="btn btn--destructive w-full mt-4">
                            Supprimer mon compte
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}