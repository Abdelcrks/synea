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
        
        <main className="mx-auto max-w-xl p-4 md:p-8 ">
            <Link href={"/profile"}
            className="inline-flex items-center gap-2 text-sm text-[#6D647A] hover:text-[#483C5C] transition">
                ← Retour
            </Link>
            <h1 className="text-2xl font-semibold text-[#483C5C]">
                Modifier mon profil
            </h1>
            <ProfileEditForm profile={profile}/>
        </main>
        
    )
}