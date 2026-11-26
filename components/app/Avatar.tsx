import type { Person } from "@/lib/demo/data";

export function Avatar({ person, size = "h-10 w-10 text-small" }: { person: Pick<Person, "name" | "gradient">; size?: string }) {
  const initials = person.name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  return (
    <span aria-hidden className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br ${person.gradient} font-display font-bold text-navy ${size}`}>
      {initials}
    </span>
  );
}
