import { db } from "@/lib/db/drizzle"
import { conversationParticipants, messages, profiles } from "@/lib/db/schema"
import { and, desc, eq, ne } from "drizzle-orm"

export async function getInbox(userId: string) {
  const myConvs = await db
    .select({ conversationId: conversationParticipants.conversationId })
    .from(conversationParticipants)
    .where(eq(conversationParticipants.userId, userId)) // recup tt les conv ou je suis dedans

  const conversationIds = myConvs.map((r) => r.conversationId) // transforme en tableau
  if (conversationIds.length === 0){
    return []
  }

  const inbox = [] // la ou les cards de conv seront stockés

  for (const conversationId of conversationIds) { // une conv à la fois
    const [last] = await db     // recup le premier élement du tableau msg le plus recent
      .select({ content: messages.content, createdAt: messages.createdAt })
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(desc(messages.createdAt))
      .limit(1)

    if (!last){
        continue // pas de msg jpasse 
    }

    // autre participant ps moi
    const [other] = await db
      .select({ otherUserId: conversationParticipants.userId })
      .from(conversationParticipants)
      .where(
        and(
          eq(conversationParticipants.conversationId, conversationId),
          ne(conversationParticipants.userId, userId) // != moi
        )
      )
      .limit(1)

    if (!other){
        continue // si pas d'autre utilisateur je next
    } 

    const [otherProfile] = await db  // recup le profil de l'autre user userId = otheruserId
      .select({ namePublic: profiles.namePublic, avatarUrl: profiles.avatarUrl })
      .from(profiles)
      .where(eq(profiles.userId, other.otherUserId))
      .limit(1)

    if (!otherProfile){
        continue // si pas de profil on nxt
    } 

    inbox.push({ // ajoute une card à inbox 
      conversationId, // lien msg/id
      otherProfile, // avatar + prenom
      lastMessage: last, // dernier msg
    })
  } 

  // trier du plus récent au plus ancien .sort (timeztamp)
  inbox.sort((a, b) => new Date(b.lastMessage.createdAt).getTime() -new Date(a.lastMessage.createdAt).getTime())

  return inbox
}
