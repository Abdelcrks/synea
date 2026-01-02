import { pgEnum, pgTable, text, timestamp,serial, integer, uniqueIndex} from "drizzle-orm/pg-core"
import { authUsers } from "./auth-schema"

export const roleEnum = pgEnum("role", ["hero","peer_hero", "admin"])


export const profiles = pgTable("profiles", {
    id:text("id").primaryKey(),

    userId: text("user_id")
    .notNull()
    .unique()
    .references(() => authUsers.id, {onDelete: "cascade"}),

    role: roleEnum("role")
    .notNull()
    .default("hero"),
    
    namePublic: text("name_public").notNull(),

    cancerType: text("cancer_type"), // slug "blood ou skin ou breast ou null car optionnel et non obligatoire si l'utilisateur choisit aucun cancer = null"
    
    acceptedTermsAt: timestamp("accepted_terms_at", {withTimezone:true}),

    createdAt: timestamp("created_at" , {withTimezone:true})
    .defaultNow()
    .notNull(),

    updatedAt: timestamp("updated_at", {withTimezone:true}),

    bio: text("bio"),


})


export const conversations = pgTable("conversations", {
    id: serial("id").primaryKey(),

    createdByUserId: text("created_by_user_id")
    .notNull()
    .references(() => authUsers.id, {onDelete: "cascade"}),

    createdByRole: roleEnum("created_by_role").notNull(),

    createdAt: timestamp("created_at", {withTimezone:true})
    .defaultNow()
    .notNull(),
})


export const conversationParticipants = pgTable("conversation_participants" , {
    id:serial("id").primaryKey(),

    conversationId: integer("conversation_id")
    .notNull()
    .references(() => conversations.id, {onDelete: "cascade"}),

    userId: text("user_id")
    .notNull()
    .references(() => authUsers.id, {onDelete: "cascade"}),

    createdAt: timestamp("created_at", {withTimezone: true})
    .defaultNow()
    .notNull(),
},
(table) => ({
    uniqConversationUser : uniqueIndex("conversation_participants_unique").on(
        table.conversationId,
        table.userId
    )
})
)



export const messages = pgTable("messages", {
    id: serial("id").primaryKey(),
    
    conversationId : integer("conversation_id")
    .notNull()
    .references(() => conversations.id, {onDelete: "cascade"}),

    senderId: text("sender_id")
    .notNull()
    .references(() => authUsers.id, {onDelete: "cascade"}),

    content: text("content").notNull(),

    createdAt: timestamp("created_at", {withTimezone: true})
    .notNull()
    .defaultNow(),
})

export * from "./auth-schema"
