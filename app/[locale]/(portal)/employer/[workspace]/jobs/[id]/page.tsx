import { notFound } from "next/navigation";

import { PermissionGate } from "@/features/auth/components/permission-gate";
import { getVacancy } from "@/features/vacancies/actions/vacancy.query.server";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ id: string; workspace: string }>;
};

export default async function FullJobDetailPage({ params }: Props) {
  const { id, workspace } = await params;
  const vacancy = await getVacancy(id).catch(() => null);

  if (!vacancy) {
    notFound();
  }

  const base = `/employer/${workspace}/jobs`;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href={base}
          className="inline-flex items-center text-xs font-medium text-muted-foreground transition hover:text-foreground"
        >
          ← Back to Vacancies
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
          <div>
            <span className="inline-block rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              {vacancy.status ?? "ACTIVE"}
            </span>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
              {vacancy.title}
            </h1>
            <p className="text-xs text-muted-foreground">
              {vacancy.location} · {vacancy.employmentType}
            </p>
          </div>

          <Link
            href={`${base}/${vacancy.id}/edit`}
            className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted"
          >
            ✏️ Edit Vacancy
          </Link>
        </div>

        <div className="py-6">
          <h2 className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Job Description
          </h2>
          <p className="text-sm leading-relaxed whitespace-pre-line text-foreground">
            {vacancy.description}
          </p>
        </div>

        <div className="border-t border-border pt-4">
          <PermissionGate resource="applicant" action="view">
            <Link
              href={`/employer/${workspace}/candidates`}
              className="text-xs font-medium text-primary hover:underline"
            >
              View applicants for this vacancy →
            </Link>
          </PermissionGate>
        </div>
      </div>
    </div>
  );
}
