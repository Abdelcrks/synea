import { and, eq, or } from "drizzle-orm";
import { db } from "../drizzle";
import { contactRequests } from "../schema";



export async function areUsersContacts (userA : string, userB: string) {
    const [isContact] = await db.select({id: contactRequests.id}).from(contactRequests)
    .where(
        and(
            eq(contactRequests.status, "accepted"),
            or(
                and(eq(contactRequests.fromUserId, userA), eq(contactRequests.toUserId, userB)), // couvre les deux sens 
                and(eq(contactRequests.fromUserId, userB), eq(contactRequests.toUserId, userA)) // a => b ou b=> a 
            )
        )
    ).limit(1)

    return Boolean(isContact) // true ok false no
}