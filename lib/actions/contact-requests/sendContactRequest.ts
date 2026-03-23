
"use server"

import { users } from "@/lib/db/auth-schema"
import { db } from "@/lib/db/drizzle"
import { and, desc, eq, isNull, or } from "drizzle-orm"
import { contactRequests, profiles } from "@/lib/db/schema"
import { revalidatePath } from "next/cache"
import { requireActiveSession } from "../auth/requireActiveSession"

export type SendContactRequestResult =
  | { ok: true }
  | { ok: false; field: "unauthenticated" | "forbidden" | "already_exists" | "not_found"; message: string }

export async function sendContactRequest(toUserId: string): Promise<SendContactRequestResult> {
  // j'ai le droit d'envoyer une demande de mise en relation à cette personne ?
  // si oui = demande créée
  // si non = pourquoi via field + message
  const session = await requireActiveSession()

  const targetId = toUserId.trim()

  if (targetId.length === 0) {
    return { ok: false, field: "not_found", message: "n'existe pas" }
  }

  if (targetId === session.user.id) {
    return { ok: false, field: "forbidden", message: "vous ne pouvez pas vous envoyer une demande" }
  }

  // vérifie que l'utilisateur ciblé existe + est actif (pas disabled / suppression demandée / supprimé)
  const [targetUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(
      and(
        eq(users.id, targetId),
        isNull(users.disabledAt),
        isNull(users.deletedAt),
      ),
    )
    .limit(1)

  if (!targetUser) {
    return { ok: false, field: "not_found", message: "Utilisateur introuvable ou indisponible" }
  }

  // récupère mon profile
  const [myProfile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, session.user.id))
    .limit(1)

  if (!myProfile) {
    return { ok: false, field: "forbidden", message: "Profil introuvable" }
  }

  // vérifie que le profil ciblé est visible (profil complété / visible)
  const [targetProfile] = await db
    .select()
    .from(profiles)
    .where(and(eq(profiles.userId, targetId), eq(profiles.isVisible, true)))
    .limit(1)

  if (!targetProfile) {
    return { ok: false, field: "not_found", message: "Utilisateur introuvable ou indisponible" }
  }

  // bloque le contact admin donc possibilité que de contacter heros <=> pair-heros
  // pour l'instant pas de pair-heros => pair-heros et pas de heros => heros
  if (myProfile.role === "admin" || targetProfile.role === "admin") {
    return { ok: false, field: "forbidden", message: "action interdite" }
  }

  if (myProfile.role === targetProfile.role) {
    return { ok: false, field: "forbidden", message: "Vous ne pouvez contacter que des profils du rôle opposé" }
  }

  // vérifie dans les deux sens si une demande existe dans n'importe quel sens
  // puis je bloque (ou je relance si canceled direct)
  const [existing] = await db
    .select({
      id: contactRequests.id,
      fromUserId: contactRequests.fromUserId,
      toUserId: contactRequests.toUserId,
      status: contactRequests.status,
    })
    .from(contactRequests)
    .where(
      or(
        and(eq(contactRequests.fromUserId, session.user.id), eq(contactRequests.toUserId, targetId)), // moi, lui
        and(eq(contactRequests.fromUserId, targetId), eq(contactRequests.toUserId, session.user.id)), // lui, moi
      ),
    )
    .orderBy(desc(contactRequests.createdAt))
    .limit(1)

  if (existing) {
    if (existing.status === "pending") {
      return { ok: false, field: "already_exists", message: "Une demande est déjà en attente" }
    }
    if (existing.status === "accepted") {
      return { ok: false, field: "already_exists", message: "Vous êtes déjà acceptés/connectés" }
    }
    if (existing.status === "rejected") {
      return { ok: false, field: "forbidden", message: "Cette personne a refuser votre demande" }
    }

    // relance uniquement si C'EST TOI qui avais annulé la demande (sens direct)
    const isDirect =
      existing.fromUserId === session.user.id &&
      existing.toUserId === targetId

    if (existing.status === "canceled" && isDirect) {
      await db
        .update(contactRequests)
        .set({
          status: "pending",
          respondedAt: null,
          // createdAt : on ne touche pas
        })
        .where(eq(contactRequests.id, existing.id))

      revalidatePath("/matching")
      revalidatePath("/requests")
      return { ok: true }
    }

    //  canceled mais pas direct => l'autre avait annulé
    // on autorise une nouvelle demande dans TON sens (insert plus bas)
    // donc ici on ne return pas

    // si un jour tu ajoutes d'autres status, bloque par défaut
    if (existing.status !== "canceled") {
      return { ok: false, field: "forbidden", message: "Demande indisponible" }
    }
  }

  // si tout est ok demande créée
  // + on protège l'insert contre les doublons (double clic / race) avec unique(fromUserId,toUserId)
  try {
    await db.insert(contactRequests).values({
      fromUserId: session.user.id,
      toUserId: targetId,
      status: "pending",
    })
  } catch (e) {
    // unique constraint => une demande directe existe déjà (ou insert concurrent)
    return { ok: false, field: "already_exists", message: "Une demande existe déjà entre vous" }
  }

  revalidatePath("/matching")
  revalidatePath("/requests")

  return { ok: true }
}