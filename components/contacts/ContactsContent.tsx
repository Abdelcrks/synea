import { ROLE_LABELS } from "@/lib/constants/roles";
import Link from "next/link";
import { Avatar } from "../profile/Avatar";

type ContactsContentProps = {
    profilesAccepted: Array<{
        userId: string;
        namePublic: string;
        avatarUrl: string | null;
        role: "hero" | "peer_hero" | "admin";
    }>;
};

export const ContactsContent = ({ profilesAccepted }: ContactsContentProps) => {
    if (profilesAccepted.length === 0) {
        return (
            <div className="rounded-2xl border-(--border) bg-(--bg-card)/70 p-6 text-center shadow-sm backdrop-blur">
                <h2 className="text-lg font-semibold text-(--text-main)">
                    Aucun contact pour le moment
                </h2>
                <p className="mt-1 text-sm text-(--text-muted)">
                    Accepte une demande ou lance un matching pour commencer une discussion.
                </p>

                <Link
                    href="/matching"
                    className="mt-4 inline-flex items-center justify-center rounded-xl bg-(--primary) px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-(--primary-hover)"
                >
                    Trouver des personnes
                </Link>
            </div>
        );
    }

    return (
        <ul className="space-y-5">
            {profilesAccepted.map((profile) => (
                <li
                    key={profile.userId}
                    className="hover:translate-y- transiti flex items-center justify-between gap-4 rounded-2xl border-(--border) bg-(--bg-card)/70 px-5 py-5
                    shadow-sm backdrop-blur transition-colors hover:bg-(--bg-card)"
                >
                    <div className="flex min-w-0 items-center gap-4">
                        <Avatar
                            name={profile.namePublic}
                            avatarUrl={profile.avatarUrl}
                        />

                        <div className="min-w-0">
                            <p className="truncate text-base font-semibold text-(--text-main)">
                                {profile.namePublic}
                            </p>
                            <p className="truncate text-sm text-(--text-muted)">
                                {ROLE_LABELS[profile.role]}
                            </p>
                        </div>
                    </div>

                    <Link
                        href={`/messages`}
                        className="focus:outline-none focus:ring-2 focus:ring-(--primary)/50 shrink-0 rounded-xl border-(--primary) bg-white/70 px-4 py-3 text-sm font-medium text-(--text-main) transition-colors hover:bg-(--primary-soft) hover:text-white"
                    >
                        Message
                    </Link>
                </li>
            ))}
        </ul>
    );
};
