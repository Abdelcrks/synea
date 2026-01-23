import { profiles } from "../schema"
import { db } from "../drizzle"
import { eq, InferSelectModel } from "drizzle-orm"

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





export const getPublicProfileById = async (profileId:string):Promise<PublicProfile | null> => {
    const result = await db.select({
        id: profiles.id,
        namePublic: profiles.namePublic,
        avatarUrl: profiles.avatarUrl,
        bio: profiles.bio,
        cancerType: profiles.cancerType,
        locationRegion: profiles.locationRegion,
        role: profiles.role,
        userId: profiles.userId,

    }).from(profiles).where(eq(profiles.id, profileId))

    return result[0] ?? null
}