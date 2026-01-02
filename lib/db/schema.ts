import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { authUsers } from "./auth-schema"

export const roleEnum = pgEnum("role", ["hero","pair_hero", "admin"])


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


export * from "./auth-schema"
