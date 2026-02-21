import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { BottomNav } from "@/components/navigation/BottomNav";
import { DesktopNav } from "@/components/navigation/DesktopNav";


export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/onboarding");
  }

  return(
    <div className="min-h-screen w-full">
      <DesktopNav />

      <main className="w-full px-4 pb-20 pt-4 md:px-6">
        {children}
      </main>

      <div className="fixed bottom-0 left-0 right-0 md:hidden">
        <BottomNav />
      </div>
    </div>
  )
}
