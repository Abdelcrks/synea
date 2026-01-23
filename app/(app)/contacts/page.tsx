import { ContactsContent } from "@/components/contacts/ContactsContent";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/drizzle";
import { contactRequests, profiles } from "@/lib/db/schema";
import { and, eq, inArray, or } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";

export default async function ContactsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return (
      <div>
        <Link href={"/auth/sign-in"}>tu n'est pas connecté, connecte toi ici</Link>
      </div>
    )
  }

  const acceptedContacts = await db.select().from(contactRequests).where(
      and(
        eq(contactRequests.status, "accepted"),
        or(
          eq(contactRequests.fromUserId, session.user.id),
          eq(contactRequests.toUserId, session.user.id)
        )
      )
    )

  const relations = acceptedContacts.map((c) => ({// transforme chaque relation requete id + moi + l'ami en question à requete id + ami en question 
    requestId: c.id,
    otherUserId: c.fromUserId === session.user.id ? c.toUserId : c.fromUserId,
  }))

  const otherUserIds = relations.map((r) => r.otherUserId) // et ici je recupere uniquement le contact en question

  const profilesAccepted = otherUserIds.length > 0
        ? await db
          .select({
            userId: profiles.userId,
            namePublic: profiles.namePublic,
            avatarUrl: profiles.avatarUrl,
            role: profiles.role,
            id: profiles.id
          })
          .from(profiles)
          .where(inArray(profiles.userId, otherUserIds)) // recupere tt les profils que j'ai en contact
        : [];


            // crée un dictionnaire a partir de userId pr recuperer le profil
  const profileByUserId = new Map(profilesAccepted.map((p) => [p.userId, p]))


  // Pr chaque relation si le profil existe ajoute requeteid, et profile  flatmap evite de faire map+ filter donc si tableau vide = rien ajouter
  const contacts = relations.flatMap((r) => {
    const profile = profileByUserId.get(r.otherUserId); // recup le profil de la personne avec qui je suis ami "otheruserid"

    if (!profile){//sinon ajoute rien
        return []
    } 
    return [{ requestId: r.requestId, profile }];
  })

  return (
    <main>
      <ContactsContent contacts={contacts} />
    </main>
  )
}

