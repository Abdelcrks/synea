import { auth } from "@/lib/auth";
import { users } from "@/lib/db/auth-schema";
import { db } from "@/lib/db/drizzle";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


export async function requireActiveSession () {
    const session = await auth.api.getSession({ headers: await headers()})
    if(!session?.user.id){
        redirect("/auth/sign-in")
    }

    const [userStatus] = await db
    .select({
      disabledAt: users.disabledAt,
      deletedAt: users.deletedAt})
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1)

    if(!userStatus){
        redirect("/auth/sign-in")
    }

    if (userStatus.deletedAt) {
        redirect("/auth/sign-in")
      }
    
      // compte désactivé
    if (userStatus.disabledAt) {
      redirect("/account-disabled")
    }
    

    return session
}
