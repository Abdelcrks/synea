import ProfileEditForm from "@/components/profile/ProfileEditForm"
import { auth } from "@/lib/auth"
import { getMyProfile } from "@/lib/db/queries/profile"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"




export default async function ProfileEdit () {

    const session = await auth.api.getSession({headers: await headers()})
        if(!session){
            redirect("/auth/sign-in")
        }
    const profile = await getMyProfile(session.user.id)
    if(!profile){
        redirect("/profile")
    }
    return(
        
        <main className="relative min-h-screen px-4 py-10 sm:px-10 ">

            <Link
                href={"/profile"}
                className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur px-3 py-1 text-sm font-medium text-[#6D647A] shadow-sm hover:text-[#483C5C] transition"
            >
                ← Retour
            </Link>
            <h1 className="text-2xl mt-4 font-semibold ">
                Modifier mon profil
            </h1>
            <ProfileEditForm profile={profile}/>
        </main>
        
    )
}