import { Profile } from "@/lib/db/queries/profile"
import Image from "next/image"
import Link from "next/link"

type ProfileViewProps = {
    profile: Profile | null,
    email: string 
}

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
    console.log(createInitiale("Abdel berkat"))
    console.log(createInitiale("ab"))
    console.log(createInitiale("a"))
    console.log(createInitiale("       abdel  "))

    if (!profile) {
        return <p>Profil introuvable</p>
      }

    const memberSince = new Date(profile.createdAt).toLocaleDateString("fr-FR")
    return(
        <div>
            <div>
                <h1>Mon profil</h1>
                <p>Complétez votre profil pour mieux échanger avec la communauté</p>
            </div>
            <div>
                <div className="avatar">
                    {profile.avatarUrl ? (
                        <Image alt={`Avatar de ${profile.namePublic}`} width={30} height={30} src={profile.avatarUrl}/>
                    ):(
                        <div className="avatar-fallback">
                            {createInitiale(profile.namePublic)}
                        </div>
                    )}
                </div>
                <h1>{profile.namePublic}</h1>
                <p>{profile.role}</p>
                <p>{profile.locationRegion ?? "Région non renseignée"}</p>
                
                <Link href={`/profile/edit`}>Modifier mon profil</Link>
            </div>
            <div>
                <h2>À propos</h2>
                <p>{profile.bio ?? "Aucune bio.."}</p>
            </div>
            <div>
                <p>Type de cancer (optionnel) {profile.cancerType}</p>
                <p>Ces informations sont facultatives. Vous choisissez ce que vous partagez.</p>
            </div>
            <div>
                <h2>Compte</h2>
                <p>Email {email}</p>
                <p>Membre depuis {memberSince}</p>
                <div>Vos données sont cryptées et ne sont jamais partagées avec des tiers à des fins commerciales</div>
            </div>
            <div>
                <h2>Préférences</h2>
                <p>Permettre aux Pair-héros de me contacter</p>
                <p>Afficher ma localisation aux autres</p>
            </div>
            <div>
                <h2>Zone sensible</h2>
                <p>La suppression de votre compte est définitive. Toutes vos données , messages et relations seront supprimés de façon irreversible.</p>
                <button>Supprimer mon compte</button>
            </div>
        </div>
    )
}