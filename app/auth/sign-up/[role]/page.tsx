
import { redirect } from "next/navigation";



type Role =  "hero" | "peer_hero"


export default async function SignUpPage({params} : {params: Promise<{ role:string}>}) {
    const {role} = await params
 
    if (role !== "hero" && role !== "peer_hero"){
        redirect("/onboarding/roles")
    }
    return(
        <main>
            <h1>inscription</h1>
            <h2>Rôle choisis : {role}</h2>
        </main>
    )
}