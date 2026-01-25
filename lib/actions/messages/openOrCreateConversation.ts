import { db } from "@/lib/db/drizzle";
import { contactRequests, conversationParticipants, conversations } from "@/lib/db/schema";
import { makeParticipantDuoId } from "@/lib/messages/makeParticipantPairId";
import { and, eq, or } from "drizzle-orm";




export  async function openOrCreateConversation (fromUserId:string, toUserId:string){


    if(fromUserId === toUserId){
        throw new Error("impossible d'ouvrir une conversation avec soi même")
    }

    const [contactStatusAccepted] = await db.select({id: contactRequests.id}).from(contactRequests) // uniquement colonne id = contactrequeteid
    .where(
        and(
            eq(contactRequests.status, "accepted"),
            or(
                and(
                    eq(contactRequests.fromUserId, fromUserId),
                    eq(contactRequests.toUserId, toUserId)
                ),
                and(
                    eq(contactRequests.fromUserId, toUserId),
                    eq(contactRequests.toUserId, fromUserId)
                )
            )

        )
    ).limit(1)

    if(!contactStatusAccepted){
        throw new Error("vous n'êtes pas amis")
    }

    const participantDuoId = makeParticipantDuoId(fromUserId, toUserId) // crée la clé de la conv

    const [conversationExisting] = await db.select({id: conversations.id}).from(conversations) // recup la conversation existante
    .where(eq(conversations.participantDuoId, participantDuoId)).limit(1)

    if(conversationExisting){     
        return conversationExisting.id
    }

    try { // au cas ou les deux cliquent en mm temps sur envoyer un msg alors qu'aucune conv existe entre ls deux
        const [createdConversation] = await db.insert(conversations).values({ // crée une conversation entre les deux
            participantDuoId: participantDuoId,
            createdByUserId: fromUserId,
        }).returning({id: conversations.id}) // uniquement cette colonne

        await db.insert(conversationParticipants).values([   // add dans l'autre table 
            {conversationId: createdConversation.id, userId:fromUserId},
            {conversationId: createdConversation.id, userId:toUserId},
        ])

        return createdConversation.id
    } catch (error) {
        const [existingAfterError] = await db.select({id: conversations.id}).from(conversations)
        .where(eq(conversations.participantDuoId, participantDuoId))
        .limit(1)
        
        if(existingAfterError){
            return existingAfterError.id
        }

        throw error // ou autre erreur
    }

}