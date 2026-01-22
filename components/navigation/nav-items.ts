import { Inbox, NotebookTabs, User, Users } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/matching", label: "Matching", icon: Users },
  { href: "/requests", label: "Requests", icon: Inbox },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/contacts", label : "Contacts", icon : NotebookTabs}
] as const


