import { profiles } from "../schema"
import { db } from "../drizzle"
import { and, eq, InferSelectModel, isNull } from "drizzle-orm"
import { users } from "../auth-schema"

// inferselectmodel sync ts => db
export type Profile = InferSelectModel<typeof profiles> // type est directement synchro avec la db  ex le type Profile = a une ligne de la table profiles
// par ex si je supp une colonne en bdd ts suivra automatiquement

export type PublicProfile = Pick<
 Profile,
    "id" | "namePublic" | "avatarUrl" | "bio" | "cancerType" | "locationRegion" | "role" | "userId"
 >

export const getMyProfile = async (userId:string) : Promise<Profile | null >=> {
    const profileDb = await db.select().from(profiles)
    .where(eq(profiles.userId, userId))

    return profileDb[0] ?? null // si undifend (tableau vide )= null  sinon [profile]
}





export const getPublicProfileById = async (profileId: string): Promise<PublicProfile | null> => {
    const result = await db
      .select({
        id: profiles.id,
        namePublic: profiles.namePublic,
        avatarUrl: profiles.avatarUrl,
        bio: profiles.bio,
        cancerType: profiles.cancerType,
        locationRegion: profiles.locationRegion,
        role: profiles.role,
        userId: profiles.userId,
      })
      .from(profiles)
      .innerJoin(users, eq(users.id, profiles.userId))
      .where(and(
        eq(profiles.id, profileId),
        eq(profiles.isVisible, true),
  
        //  user actif
        isNull(users.disabledAt),
        isNull(users.deletedAt),
      ))
      .limit(1)
  
    return result[0] ?? null
  }