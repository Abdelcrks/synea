import { Profile } from "@/lib/db/queries/profile"
import Image from "next/image"
import Link from "next/link"
import { CANCER_LABELS } from "@/lib/constants/cancer"
import { ROLE_LABELS } from "@/lib/constants/roles"
import { signOutAction } from "@/lib/actions/auth/signOutAction"

type ProfileViewProps = {
    profile: Profile | null,
    email: string 
}

// export const ROLE_LABELS = {
//         hero:"Héros",
//         peer_hero: "Pair-héros",
//         admin: "Administrateur",
// } as const 

// export type Role = keyof typeof ROLE_LABELS


export const ProfileView = ({profile,email}: ProfileViewProps) => {

    const createInitiale = (name:string ) => {
       if(!name) return ""
       const words = name.trim().split(" ")
        if (words.length >= 2){
            return (words[0][0] + words[1][0]).toUpperCase()
        } else{
                return words[0].slice(0,2).toUpperCase()
        }
    }
    // console.log(createInitiale("Abdel berkat"))
    // console.log(createInitiale("ab"))
    // console.log(createInitiale("a"))
    // console.log(createInitiale("       abdel  "))

    if (!profile) {
        return <p>Profil introuvable</p>
      }

 
    const memberSince = new Date(profile.createdAt).toLocaleDateString("fr-FR")
    return(
        <section className="mx-auto max-w-xl p-4 md:p-8 space-y-6 ">
        {/* <div className="p-6 shadow-sm"> */}
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold text-[#483C5C] ">Mon profil</h1>
                <p className="text-sm text-muted-foreground text-[#6D647A]">Complétez votre profil pour mieux échanger avec la communauté</p>
            </div>
            <div className="rounded-2xl  bg-white p-4 space-y-3 flex flex-col items-center justify-center shadow-xl">
                <div className="h-12 w-12 relative object-cover rounded-full flex items-center justify-center overflow-hidden border border-[#9F86C0]">
                    {profile.avatarUrl ? (
                        <Image alt={`Avatar de ${profile.namePublic}`} fill src={profile.avatarUrl}/>
                    ):(
                        <div id="avatar-fallback" className="text-[#483C5C]">
                            {createInitiale(profile.namePublic)}
                        </div>
                    )}
                </div>
                <h1 className="text-[#483C5C] font-semibold">{profile.namePublic}</h1>
                <span className="text-sm px-3 py-1 rounded-full bg-[#9F86C0]/30 text-[#6D647A] font-semibold">{ROLE_LABELS[profile.role]}</span>
                <p className="text-[#6D647A]">{profile.locationRegion ?? "Région non renseignée"}</p>
                
                <Link href={`/profile/edit`} className="inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white bg-[#9F86C0]">Modifier mon profil</Link>
            </div>
            <div className="rounded-2xl shadow-xl bg-white p-4 space-y-2">
                <h2 className="text-[#483C5C] font-semibold">À propos</h2>
                <p>{profile.bio ?? "Aucune bio.."}</p>
            </div>
            <div className="rounded-2xl shadow-xl bg-white p-4 space-y-2">
                <h2 className="text-[#483C5C] font-semibold">Informations (optionnel) </h2>
                <p className="text-[#6D647A]">Type de cancer (optionnel) : {profile.cancerType ? CANCER_LABELS[profile.cancerType] : "Non renseigné"}</p>
                <p className="text-xs text-[#6D647A] italic">Ces informations sont facultatives. Vous choisissez ce que vous partagez.</p>
            </div>
            <div className="rounded-2xl shadow-xl bg-white p-4 space-y-2">
                <h2 className="text-[#483C5C] font-semibold">Compte</h2>
                <div className="flex items-center justify-between">
                    <p className="text-[#6D647A]">Email : {email}</p>
                    <Link href={"/settings/security#email"} 
                    className="text-sm font-medium text-[#9F86C0]">
                    Gérer
                    </Link>
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-[#6D647A]">Mot de passe : ••••••••</p>
                    <Link className="text-sm text-[#9F86C0] font-medium "
                     href={"/settings/security#password"}>
                    Gérer
                    </Link>
                </div>
                <p className="text-[#6D647A]">Membre depuis : {memberSince}</p>
                <div className="text-xs text-[#6D647A] italic">Vos informations ne sont jamais partagées à des fins commerciales.</div>
                <form action={signOutAction} className="pt-2">
                    <button className="w-full cursor-pointer rounded-full border text-white bg-[#9F86C0] px-6 py-3 text-sm font-semibold">Se déconnecter</button>
                </form>
            </div>
            <div className="rounded-2xl shadow-xl bg-white p-4 space-y-2">
                <h2 className="text-[#483C5C] font-semibold">Préférences</h2>
                <p className="text-[#6D647A]">Permettre aux Pair-héros de me contacter</p>
                <p className="text-[#6D647A]">Afficher ma localisation aux autres</p>
            </div>
            <div className="rounded-2xl shadow-xl flex flex-col   bg-white p-4 space-y-2">
                <h2 className="text-[#483C5C] font-semibold">Zone sensible</h2>
                <p className="text-red-900 text-center">La suppression de votre compte est définitive. Toutes vos données , messages et relations seront supprimés de façon irreversible.</p>
                <button type="button" className="bg-red-600 w-full rounded-full px-6 py-3 text-sm font-semibold text-white">Supprimer mon compte</button>
            </div>

        {/* </div> */}
        </section>
    )
}