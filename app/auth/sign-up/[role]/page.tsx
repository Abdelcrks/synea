
import { redirect } from "next/navigation";
import { SignUpForm } from "./SignUpForm";
import { cancerTypeEnum } from "@/lib/db/schema";



type Role =  "hero" | "peer_hero"


export default async function SignUpPage({params} : {params: Promise<{ role:string}>}) {
    const {role} = await params
 
    if (role !== "hero" && role !== "peer_hero"){
        redirect("/onboarding/roles")
    }

    const cancerTypes = cancerTypeEnum.enumValues
    return(
        <main>
            <h1>inscription</h1>
            <h2>Rôle choisis : {role}</h2>
            <SignUpForm role={role} cancerTypes={cancerTypes}></SignUpForm>
        </main>
    )
}