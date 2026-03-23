

import { users } from "./auth-schema"
import { pgEnum, pgTable, text, timestamp,serial, integer, uniqueIndex, boolean, index} from "drizzle-orm/pg-core"


export const roleEnum = pgEnum("role", ["hero","peer_hero", "admin"])
export const ROLES = roleEnum.enumValues
export type Role = (typeof ROLES)[number]

export const cancerTypeEnum = pgEnum("cancer_type", [
    "bone",
    "breast",
    "lung",
    "skin",
    "brain",
    "digestive",
    "gynecologic",
    "urologic",
    "head_neck",
    "leukemia",
    "lymphoma",
    "myeloma",
    "sarcoma",
    "other",
])
export const CANCER_TYPES = cancerTypeEnum.enumValues;
export type CancerType = (typeof CANCER_TYPES)[number];


export const contactRequestStatusEnum = pgEnum("status", [
    "pending",
    "accepted",
    "rejected",
    "canceled",
])


export const profiles = pgTable("profiles", {
    id:text("id").primaryKey(),

    userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, {onDelete: "cascade"}),

    role: roleEnum("role")
    .notNull()
    .default("hero"),
    
    namePublic: text("name_public").notNull(),

    cancerType: cancerTypeEnum("cancer_type"),

    bio: text("bio"),

    avatarUrl: text("avatar_url"),

    locationRegion: text("location_region"),

    showRegionPublic: boolean("show_region_public").notNull().default(false),

    isVisible : boolean("is_visible").notNull().default(true),

    acceptedTermsAt: timestamp("accepted_terms_at", {withTimezone:true}),

    createdAt: timestamp("created_at" , {withTimezone:true})
    .defaultNow()
    .notNull(),

    updatedAt: timestamp("updated_at", {withTimezone:true}),
    


})

export const contactRequests = pgTable("contact_requests", {
    id: serial("id").primaryKey(),

    fromUserId: text("from_user_id")
    .notNull()
    .references(()=> users.id, {onDelete:"cascade"}),

    toUserId: text("to_user_id").notNull()
    .references(() => users.id, {onDelete:"cascade"}),

    status: contactRequestStatusEnum("status")
    .notNull().default("pending"),

    createdAt: timestamp("created_at", {withTimezone:true}).defaultNow().notNull(),


    respondedAt: timestamp("responded_at", {withTimezone:true}),
}, (table) => ({
    uniqFromTo: uniqueIndex("contact_requests_unique").on(table.fromUserId, table.toUserId)
}))







export const conversations = pgTable("conversations", {
    id: serial("id").primaryKey(),
    
    participantDuoId : text("participant_duo_id").notNull().unique(),

    createdByUserId: text("created_by_user_id")
    .references(() => users.id, {onDelete: "set null"}), // rgpd

    createdAt: timestamp("created_at", {withTimezone:true})
    .defaultNow()
    .notNull(),
})


export const conversationParticipants = pgTable("conversation_participants" , {
    id:serial("id").primaryKey(),

    userKey : text("user_key").notNull(),

    conversationId: integer("conversation_id")
    .notNull()
    .references(() => conversations.id, {onDelete: "cascade"}),

    userId: text("user_id")
    .references(() => users.id, {onDelete: "set null"}), // rgpd


    userNameSnapshot: text("user_name_snapshot"),

    createdAt: timestamp("created_at", {withTimezone: true})
    .defaultNow()
    .notNull(),
},
(table) => ({
    conversationIdx : index("conversation_participants_conversation_id_idx").on(
        table.conversationId
    ),
    uniqConversationUser : uniqueIndex("conversation_participants_unique").on(
        table.conversationId,
        table.userKey
    ),

})
)



export const messages = pgTable("messages", {
    id: serial("id").primaryKey(),
    
    conversationId : integer("conversation_id")
    .notNull()
    .references(() => conversations.id, {onDelete: "cascade"}),

    senderId: text("sender_id")
    .references(() => users.id, {onDelete: "set null"}), //rgpd
    senderNameSnapshot: text("sender_name_snapshot"),
    senderAvatarSnapshot: text("sender_avatar_snapshot"),   

    content: text("content").notNull(),

    createdAt: timestamp("created_at", {withTimezone: true})
    .notNull()
    .defaultNow(),
},
(table) => ({
    convoCreatedIdx: index("messages_conversation_created_idx").on(
        table.conversationId,
        table.createdAt
    )
}),
)

