import { Link } from "@/i18n/navigation";

import type { Vacancy } from "../schema";

export function VacancyCard({
  vacancy,
  href,
}: {
  vacancy: Vacancy;
  href?: string;
}) {
  const body = (
    <article className="rounded-lg border border-border p-4">
      <h2 className="font-medium">{vacancy.title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{vacancy.location}</p>
      <p className="mt-2 text-sm leading-relaxed">{vacancy.description}</p>
    </article>
  );

  if (!href) {
    return body;
  }

  return <Link href={href}>{body}</Link>;
}
