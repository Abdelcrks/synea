import type { Role } from "@/lib/db/schema"

export const ROLE_LABELS: Record<Role, string> = {
  hero: "Héros",
  peer_hero: "Pair-héros",
  admin: "Administrateur",
}
