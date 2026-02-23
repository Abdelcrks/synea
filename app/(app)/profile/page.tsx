import { ProfileView } from "@/components/profile/ProfileView";
import { requireActiveSession } from "@/lib/actions/auth/requireActiveSession";
import { getMyProfile } from "@/lib/db/queries/profile";
import { redirect } from "next/navigation";




export default async function Profile ()  {
    const session = await requireActiveSession()

    const userId = session?.user?.id
        if(!userId){
            redirect("/auth/sign-in")
        }
    const profile = await getMyProfile(userId)
    return(
        <main>
            <ProfileView profile={profile} email={session.user.email}></ProfileView>
        </main>
    )
}