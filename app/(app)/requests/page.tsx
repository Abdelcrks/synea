import { RequestCard } from "@/components/requests/RequestCard";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/drizzle";
import { contactRequests, profiles} from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";



export default async function RequestPage() {
    const session = await auth.api.getSession({headers: await headers()})
    if(!session){
        return(
            <div>
                <h1>Tu n'es pas connecté</h1>
                <Link href={"/auth/sign-in"}></Link>
            </div>
        )
    }

    const myUserId = session.user.id
    const requestReceived = await db.select().from(contactRequests).where(
      (and(
        eq(contactRequests.toUserId, myUserId),
        eq(contactRequests.status, "pending")
      ))
    )

    const requestSent = await db.select().from(contactRequests).where(
        (and(
            eq(contactRequests.fromUserId, myUserId),
            eq(contactRequests.status, "pending")
        ))
    )

    const receivedWithProfiles = await Promise.all(requestReceived.map(async (request) => { // pr chaque demande va chercher le profil att que tlm est répondu , et donne moi un tableau final avec les données
        const [profile] = await db.select().from(profiles)
        .where(eq(profiles.userId, request.fromUserId)).limit(1)

        return {request, profile} 
    }))

    const sentWithProfiles = await Promise.all(requestSent.map (async (request) => { // map async = Promise all sinon tableau de chaque promesse donc impsosible a exploiter
        const [profile] = await db.select().from(profiles)          // Promise All = att plusieurs opérations async donc obligatoire avec le map (async)
        .where(eq(profiles.userId, request.toUserId)).limit(1)

        return {request, profile} 
    }))

    // const receivedClean = receivedWithProfiles.filter(Boolean) 
    // const sentClean = sentWithProfiles.filter(Boolean)

    const receivedClean = receivedWithProfiles.filter((item) => item !== undefined)

    const sentClean = sentWithProfiles.filter((item) =>  item !== undefined)


    return(
        <main className="mx-auto max-w-xl p-4 md:p-8 space-y-6">
            {/* <div>
                <h1>demande reçues</h1>
                <pre>{JSON.stringify(requestReceived, null, 2)}</pre>
            </div>

            <div>
                <h1>Demande envoyées</h1>
                <pre>{JSON.stringify(requestSent, null, 2)}</pre>
            </div> */}
            <section>
                <h1>Demande reçues</h1>
                {receivedClean.length === 0 ? (
                    <p>Aucune demande</p>
                ): (
                    receivedClean.map(({request, profile}) => (
                        <RequestCard key={request.id} profile={profile} requestId={request.id} type="received"/>
                    ))
                )}
            </section>
            <section>
                <h1>Demande envoyées</h1>
                {sentClean.length === 0 ? (
                    <p>aucune demande envoyée</p>
                ):(
                    sentClean.map(({request, profile}) => (
                        <RequestCard key={request.id} profile={profile} requestId={request.id} type="sent"></RequestCard>
                    ))
                )}
            </section>
        </main>
    )
}