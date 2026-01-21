import Image from "next/image";

type AvatarProps = {
  name: string;
  avatarUrl?: string | null;
}

function getInitials(name: string) {
  const words = name.trim().split(" ")

  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }

  return words[0].slice(0, 2).toUpperCase()
}

export function Avatar({ name, avatarUrl }: AvatarProps) {
  return (
    <div className="relative h-12 w-12 rounded-full border border-[#9F86C0] bg-white flex items-center justify-center overflow-hidden font-semibold text-[#6D647A]">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={`Avatar de ${name}`}
          fill
          className="object-cover"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
}
