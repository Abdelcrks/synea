"use server"

import { ProfileCard } from "@/components/matching/ProfileCard"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db/drizzle"
import { getMyProfile } from "@/lib/db/queries/profile"
import { profiles } from "@/lib/db/schema"
import { and, eq, ne } from "drizzle-orm"
import { headers } from "next/headers"
import Link from "next/link"


export default async function MatchingPage ()  {
    const session = await auth.api.getSession({headers: await headers()})
    if(!session){
        return(
            <div>
            <h1>Vous n'êtes pas connecté </h1>
            <Link href={"/auth/sign-in"}>m'authentifier</Link>
            </div>
            )
    }
    const userId = session.user.id

    const myProfile = await getMyProfile(userId)
    let targetRole: "hero" | "peer_hero" | null = null

    if (!myProfile) {
        return (<p>Profil introuvable</p>);
    }
    if(myProfile.role ==="hero"){
        targetRole = "peer_hero"
    }else if(myProfile.role ==="peer_hero"){
        targetRole = "hero"
    }else{
        return(<p>acces non autorisé</p>)
    }


    const profileToShow = await db.select().from(profiles)
    .where(and(
        eq(profiles.role, targetRole),
        eq(profiles.isVisible, true),
        ne(profiles.userId, session.user.id) // non equal
    ))
    return(
        <main>
            {profileToShow.map((profile) => (
                <ProfileCard key={profile.userId} profile={profile} />
            ))}
        </main>
    )

}



