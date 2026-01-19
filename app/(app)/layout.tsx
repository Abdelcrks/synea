import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { BottomNav } from "@/components/navigation/BottomNav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen w-full">
      <main className="mx-auto w-full max-w-3xl px-4 pb-20 pt-4">
        {children}
      </main>

      <div className="fixed bottom-0 left-0 right-0 md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
