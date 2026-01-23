import { CircleUser, Inbox, Sparkles, User, UserPlus, UserRound, Users } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/matching", label: "Matching", icon: Sparkles },
  { href: "/requests", label: "Demandes", icon: Inbox },
  { href: "/profile", label: "Profil", icon: CircleUser },
  { href: "/contacts", label: "Contacts", icon: UserRound},
] as const


