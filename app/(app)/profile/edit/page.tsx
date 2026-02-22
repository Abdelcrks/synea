import ProfileEditForm from "@/components/profile/ProfileEditForm"
import { auth } from "@/lib/auth"
import { getMyProfile } from "@/lib/db/queries/profile"
import { headers } from "next/headers"
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
            <ProfileEditForm profile={profile}/>
        </main>
        
    )
}