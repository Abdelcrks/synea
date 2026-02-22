import { ProfileView } from "@/components/profile/ProfileView";
import { auth } from "@/lib/auth";
import { getMyProfile } from "@/lib/db/queries/profile";
import { headers } from "next/headers";
import { redirect } from "next/navigation";




export default async function Profile ()  {
    const session = await auth.api.getSession({headers : await headers()})
        if(!session){
            redirect("/auth/sign-in")
        }
    
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