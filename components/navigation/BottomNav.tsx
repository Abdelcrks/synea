"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav-items";



export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="flex h-16 border-t border-(--border) bg-white/90 backdrop-blur md:hidden">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center justify-center gap-1 text-xs transition-all duration-200 ${
              isActive
                ? "text-(--text-main)"
                : "text-(--text-main)"
            }`}
          >
            <div
              className={`flex items-center justify-center rounded-full p-2 transition ${
                isActive
                  ? "bg-(--primary-soft)"
                  : "text-(--text-main)"
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>

            <span className={`${isActive ? "font-semibold" : ""}`}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
