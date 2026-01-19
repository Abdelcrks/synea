
import { redirect } from "next/navigation";
import { SignUpForm } from "./SignUpForm";
import { cancerTypeEnum } from "@/lib/db/schema";
import Link from "next/link";



type Role =  "hero" | "peer_hero"


export default async function SignUpPage({searchParams} : {searchParams: Promise<{ role?:string}>}) {
    const queryParams = await searchParams

    const cancerTypes = cancerTypeEnum.enumValues
    const roleParam = queryParams.role
    const defaultRole : Role | "" = roleParam === "hero" || roleParam === "peer_hero" ? roleParam : ""
    return(
        <main className="text-center">
            {/* <h1>inscription</h1>
            <h2>Rôle choisis : {defaultRole || "non choisi"}</h2> */}
            <Link href={"/auth/sign-in"} className="mt-10 p-2 rounded-full inline-flex cursor-pointer text-[#6D647A] hover:text-[#483C5C] transition">Déjà inscris ? par ici</Link>
            <SignUpForm defaultRole={defaultRole} cancerTypes={cancerTypes}></SignUpForm>
        </main>
    )
}