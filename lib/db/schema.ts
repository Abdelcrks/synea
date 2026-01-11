

import { users } from "./auth-schema"
import { pgEnum, pgTable, text, timestamp,serial, integer, uniqueIndex, boolean} from "drizzle-orm/pg-core"


export const roleEnum = pgEnum("role", ["hero","peer_hero", "admin"])
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

    profileCompletedAt: timestamp("profile_completed_at", {withTimezone:true}),

    acceptedTermsAt: timestamp("accepted_terms_at", {withTimezone:true}),

    createdAt: timestamp("created_at" , {withTimezone:true})
    .defaultNow()
    .notNull(),

    updatedAt: timestamp("updated_at", {withTimezone:true}),


})


export const conversations = pgTable("conversations", {
    id: serial("id").primaryKey(),

    createdByUserId: text("created_by_user_id")
    .notNull()
    .references(() => users.id, {onDelete: "cascade"}),

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
    .references(() => users.id, {onDelete: "cascade"}),

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
    .references(() => users.id, {onDelete: "cascade"}),

    content: text("content").notNull(),

    createdAt: timestamp("created_at", {withTimezone: true})
    .notNull()
    .defaultNow(),
})

