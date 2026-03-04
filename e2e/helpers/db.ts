import { neon } from "@neondatabase/serverless";
import "dotenv/config";

export async function resetContactRequests(userAId: string, userBId: string) {
    const sql = neon(process.env.DATABASE_URL!);
    const result = await sql`
      DELETE FROM contact_requests
      WHERE (from_user_id = ${userAId} AND to_user_id = ${userBId})
         OR (from_user_id = ${userBId} AND to_user_id = ${userAId})
      RETURNING id
    `;
    console.log(`[db] reset: ${result.length} demande(s) supprimée(s)`);
  }