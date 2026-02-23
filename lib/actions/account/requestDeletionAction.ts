// "use server"

// import { auth } from "@/lib/auth"
// import { requireActiveSession } from "@/lib/actions/auth/requireActiveSession"
// import { db } from "@/lib/db/drizzle"
// import { users } from "@/lib/db/auth-schema"
// import { eq } from "drizzle-orm"
// import { headers } from "next/headers"
// import { redirect } from "next/navigation"

// export async function requestDeletionAction() {
//   const session = await requireActiveSession()

//   const now = new Date()

//   await db
//     .update(users)
//     .set({
//       deletionRequestedAt: now,
//       disabledAt: now,
//     })
//     .where(eq(users.id, session.user.id))

//   await auth.api.signOut({ headers: await headers() })

//   redirect("/account-deletion")
// }