import { StaleSweepButton } from "@/features/applications/components/stale-sweep-button";
import { PermissionGate } from "@/features/auth/components/permission-gate";
import { EmployerVacancyList } from "@/features/vacancies/components/employer-vacancy-list";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ workspace: string }>;
};

export default async function WorkspaceJobsPage({ params }: Props) {
  const { workspace: slug } = await params;
  const base = `/employer/${slug}/jobs`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Job Vacancies
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage your active vacancies, create new job openings, and review
            returned listings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StaleSweepButton />
          <Link
            href={`${base}/create`}
            className="rounded-md bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground shadow transition hover:bg-primary/90"
          >
            + Post Vacancy
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <PermissionGate resource="vacancy" action="view">
          <EmployerVacancyList workspaceSlug={slug} />
        </PermissionGate>
      </div>
    </div>
  );
}
