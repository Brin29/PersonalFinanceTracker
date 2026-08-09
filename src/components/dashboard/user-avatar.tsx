import type { User } from "@/lib/types/auth";

interface UserAvatarProps {
  user?: User;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
}

const SIZE_CLASSES = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-lg",
  xl: "size-18 text-xl",
  "2xl": "size-24 text-2xl",
} as const;

type AvatarSize = keyof typeof SIZE_CLASSES;

export function getInitials(user?: User): string {
  if (!user) return " ";
  const first = user.firstName?.charAt(0) ?? "";
  const last = user.lastName?.charAt(0) ?? "";
  return (first + last).toUpperCase() || user.email.charAt(0).toUpperCase();
}

interface AvatarImageProps {
  user: User;
  size: AvatarSize;
}

function AvatarImage({ user, size }: AvatarImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={user.avatar}
      alt={`Avatar de ${user.firstName} ${user.lastName}`}
      className={`${SIZE_CLASSES[size]} rounded-full object-cover ring-1 ring-line`}
    />
  );
}

interface AvatarFallbackProps {
  user?: User;
  size: AvatarSize;
}

function AvatarFallback({ user, size }: AvatarFallbackProps) {
  return (
    <span
      className={`${SIZE_CLASSES[size]} flex items-center justify-center rounded-full bg-leaf-50 font-mono font-semibold text-leaf-700 ring-1 ring-line`}
      aria-hidden="true"
    >
      {getInitials(user)}
    </span>
  );
}

export function UserAvatar({ user, size = "md" }: UserAvatarProps) {
  return user?.avatar ? (
    <AvatarImage user={user} size={size} />
  ) : (
    <AvatarFallback user={user} size={size} />
  );
}
