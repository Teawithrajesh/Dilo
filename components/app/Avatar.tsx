import type { Person } from "@/lib/demo/data";

export function Avatar({ person, size = "h-10 w-10 text-small" }: { person: Pick<Person, "name" | "gradient" | "photo">; size?: string }) {
  if (person.photo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={person.photo} alt="" aria-hidden data-testid="avatar-photo" className={`shrink-0 rounded-full object-cover ${size}`} />;
  }
  const initials = person.name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  return (
    <span aria-hidden className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br ${person.gradient} font-display font-bold text-navy ${size}`}>
      {initials}
    </span>
  );
}
