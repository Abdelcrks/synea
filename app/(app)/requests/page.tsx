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

    const receivedClean = receivedWithProfiles.filter((item) => item !== undefined)

    const sentClean = sentWithProfiles.filter((item) =>  item !== undefined)


    return (
        <main className="container-page section space-y-10">
          <header className="space-y-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold md:text-3xl">Mes demandes</h1>
                <p className="mt-1 text-sm muted">
                  Gérez vos demandes reçues et envoyées.
                </p>
              </div>
      
              <Link href="/contacts" className="btn btn--secondary w-full sm:w-auto">
                Mes contacts
              </Link>
            </div>
          </header>
      
          <div className="grid gap-8 lg:grid-cols-12">
            <section className="lg:col-span-6 space-y-4">
              <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-semibold">
                  Demandes reçues <span className="muted">({receivedClean.length})</span>
                </h2>
              </div>
      
              {receivedClean.length === 0 ? (
                <div className="card card--outline">
                  <p className="text-sm muted">Aucune demande reçue pour le moment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {receivedClean.map(({ request, profile }) => (
                    <RequestCard
                      key={request.id}
                      profile={profile}
                      requestId={request.id}
                      type="received"
                    />
                  ))}
                </div>
              )}
            </section>
      
            <section className="lg:col-span-6 space-y-4">
              <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-semibold">
                  Demandes envoyées <span className="muted">({sentClean.length})</span>
                </h2>
              </div>
      
              {sentClean.length === 0 ? (
                <div className="card card--outline">
                  <p className="text-sm muted">Aucune demande envoyée pour le moment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sentClean.map(({ request, profile }) => (
                    <RequestCard
                      key={request.id}
                      profile={profile}
                      requestId={request.id}
                      type="sent"
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      )
}