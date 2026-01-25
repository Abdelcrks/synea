import { PublicProfileView } from "@/components/profile/PublicProfilView"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db/drizzle"
import { getPublicProfileById } from "@/lib/db/queries/profile"
import { contactRequests } from "@/lib/db/schema"
import { and, eq, or } from "drizzle-orm"
import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"



type PageProps = {
    params: Promise<{id:string}>
}

export type RelationStatus = 
    | "self"
    | "connected"
    | "none" 
    | "pending_incoming"
    | "pending_outgoing"

export default async function PublicProfilPage ({params}: PageProps) {
    const session = await auth.api.getSession({headers: await headers()})
    if(!session){
        redirect("/auth/sign-in")
    }

    const {id} =  await params
    const profile = await getPublicProfileById(id)

    if(!profile){
        notFound()
    }
    if(profile.userId === session.user.id){
       return (
        <main className="mx-auto w-full max-w-3xl px-4 pb-20 pt-4">
            <PublicProfileView profile={profile} relationStatus="self" requestId={null}/>
        </main>
       )
    }


    const [request] = await db.select({   // cherche demande de contact moi vers lui ou lui vers moi
        id: contactRequests.id,
        fromUserId: contactRequests.fromUserId,
        toUserId: contactRequests.toUserId,
        status: contactRequests.status,
    }).from(contactRequests).where(
        or(
            and(
                eq(contactRequests.fromUserId, session.user.id),
                eq(contactRequests.toUserId, profile.userId)
            ),
            and(
                eq(contactRequests.fromUserId, profile.userId),
                eq(contactRequests.toUserId, session.user.id)

            )
        )
    ).limit(1)


    let relationStatus: RelationStatus = "none"
    let requestId: number | null = null

    if(request){
        requestId= request.id

        if (request.status === "accepted"){
            relationStatus = "connected"
        }
        else if(request.status === "pending"){
            relationStatus = request.fromUserId === session.user.id ? "pending_outgoing" : "pending_incoming"
        }
        else {relationStatus = "none"} // annuler ou rejeter
    }

    return (
        <main className="mx-auto w-full max-w-3xl px-4 pb-20 pt-4">
        <PublicProfileView
          profile={profile}
          relationStatus={relationStatus}
          requestId={requestId}
        />
      </main>
    )
}