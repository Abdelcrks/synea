
import { redirect } from "next/navigation";
import { SignUpForm } from "@/app/auth/sign-up/SignUpForm";
import { cancerTypeEnum } from "@/lib/db/schema";



type Role =  "hero" | "peer_hero"


export default async function SignUpPage({searchParams} : {searchParams: Promise<{ role?:string}>}) {
    const queryParams = await searchParams

    const cancerTypes = cancerTypeEnum.enumValues
    const roleParam = queryParams.role
    const defaultRole : Role | "" = roleParam === "hero" || roleParam === "peer_hero" ? roleParam : ""
    return(
        <main>
            <h1>inscription</h1>
            <h2>Rôle choisis : {defaultRole || "non choisi"}</h2>
            <SignUpForm defaultRole={defaultRole} cancerTypes={cancerTypes}></SignUpForm>
        </main>
    )
}