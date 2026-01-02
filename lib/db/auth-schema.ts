import {
    pgTable,
    text,
    timestamp,
    boolean,
  } from "drizzle-orm/pg-core";
  
  export const authUsers = pgTable("auth_users", {
    id: text("id").primaryKey(),
  
    email: text("email").notNull().unique(),
  
    passwordHash: text("password_hash").notNull(),
  
    emailVerified: boolean("email_verified")
      .default(false)
      .notNull(),
  
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  });
  

  export const authSessions = pgTable("auth_sessions", {
    id: text("id").primaryKey(),
  
    userId: text("user_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
  
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  });
  