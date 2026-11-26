import type { Community } from "@/lib/demo/data";

/** Cover banner: the community's own image, or its colour if none. */
export function Cover({ c, className = "h-40" }: { c: Pick<Community, "gradient" | "coverImage" | "name">; className?: string }) {
  return c.coverImage ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={c.coverImage} alt={`${c.name} cover`} data-testid="cover-image" className={`w-full object-cover ${className}`} />
  ) : (
    <div aria-hidden className={`w-full bg-gradient-to-br ${c.gradient} opacity-85 ${className}`} />
  );
}

/** Community photo: the uploaded picture, or initials on the community colour. */
export function CommunityPhoto({ c, size = "h-12 w-12 text-body", ring = false }: { c: Pick<Community, "gradient" | "photo" | "name">; size?: string; ring?: boolean }) {
  const initials = c.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const frame = `shrink-0 overflow-hidden rounded-2xl ${ring ? "ring-4 ring-navy" : ""} ${size}`;
  return c.photo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={c.photo} alt={`${c.name} photo`} data-testid="community-photo" className={`object-cover ${frame}`} />
  ) : (
    <span aria-hidden className={`grid place-items-center bg-gradient-to-br ${c.gradient} font-display font-extrabold text-navy ${frame}`}>{initials}</span>
  );
}
