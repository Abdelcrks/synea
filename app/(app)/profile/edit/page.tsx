import ProfileEditForm from "@/components/profile/ProfileEditForm"
import { requireActiveSession } from "@/lib/actions/auth/requireActiveSession"
import { getMyProfile } from "@/lib/db/queries/profile"
import { redirect } from "next/navigation"




export default async function ProfileEdit () {

    const session = await requireActiveSession()

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