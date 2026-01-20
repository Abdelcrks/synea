"use client"
import { Inbox, User, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav-items";



// const NAV_ITEMS = [ 
//     {href:"/matching", label:"Matching", icon:Users},
//     {href:"/requests", label: "Requests", icon: Inbox},
//     {href:"/profile", label: "Profile", icon:User},]

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="flex h-16 border-t bg-background/80 backdrop-blur">
        {NAV_ITEMS.map(({href,label,icon:Icon}) => {
            const isActive = pathname === href
            return(
                <Link
                key={href}
                href={href}
                className={`flex flex-1 flex-col items-center justify-center gap-1 text-xs transition-colors ${
                    isActive ? "text-foreground font-medium" : "text-muted-foreground"
                  }`}
                
                ><Icon className="h-5 w-5"/>{label}</Link>
            )
        })}
    </nav>
  );
}
