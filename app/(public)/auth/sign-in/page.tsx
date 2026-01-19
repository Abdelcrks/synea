import Link from "next/link";
import { SignInForm } from "./SignInForm";

export default function SignInPage() {
    return (
      <main className="p-10 text-center">
        <h1 className="text-2xl font-bold">Connexion</h1>
        <Link href={"/auth/sign-up"} className="p-2 rounded-full inline-flex cursor-pointer text-[#6D647A] hover:text-[#483C5C] transition">Pas encore inscrit ? par ici</Link>
        <p>Connecte-toi avec ton email et ton mot de passe</p>
        <SignInForm></SignInForm>
      </main>
    )
  }