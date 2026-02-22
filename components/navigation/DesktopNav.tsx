"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav-items"

export function DesktopNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex h-16 items-center justify-center gap-6 border-b border-(--border) bg-white/80 backdrop-blur">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-200 ${
              isActive
                ? "bg-(--primary-soft) text-(--primary) font-semibold"
                : "text-(--text-muted) hover:text-(--text-main)"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
