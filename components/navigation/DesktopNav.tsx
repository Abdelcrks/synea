"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav-items"

export function DesktopNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex h-16 items-center justify-center gap-8 border-b bg-background/80 backdrop-blur">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors
              ${
                isActive
                  ? "bg-[#9F86C0]/15 text-[#9F86C0] font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }
            `}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
