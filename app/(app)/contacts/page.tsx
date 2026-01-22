import { ContactsContent } from "@/components/contacts/ContactsContent";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/drizzle";
import { contactRequests, profiles } from "@/lib/db/schema";
import { and, eq, inArray, or } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";


export default async function ContactsPage () {

    const session = await auth.api.getSession({headers: await headers()})
    if(!session){
        return (
            <div><Link href={"/auth/sign-in"}>tu n'est pas connecté, connecte toi ici</Link></div>
        )
    }
    const acceptedContacts = await db.select().from(contactRequests).where(
        and(
            eq(contactRequests.status, "accepted"),
            or(eq(contactRequests.fromUserId, session.user.id), eq(contactRequests.toUserId, session.user.id))
        )
    )

    const contactsUserIds = acceptedContacts.map((contact) => { // filtre en m'enlevant moi de chaque relation accepté 
        if(contact.fromUserId === session.user.id){
            return contact.toUserId
        }
        return contact.fromUserId
    })


    // inArray = dans cette liste dnc recupere tout les priofles dont l'id est dans cette liste)
    const profilesAccepted = contactsUserIds.length > 0 
        ? await db.select().from(profiles).where(inArray(profiles.userId, contactsUserIds))  
        : [] // si vide tableau vide sinon profil recupérés



    return (
        <main>
            <ContactsContent profilesAccepted={profilesAccepted}/>
        </main>
    )
}

