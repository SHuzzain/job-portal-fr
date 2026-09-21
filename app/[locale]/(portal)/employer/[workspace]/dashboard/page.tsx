import { requireWorkspaceAccess } from "@/features/companies/actions/workspace.query.server";
import { EmployerShortcuts } from "@/features/companies/components/employer-shortcuts";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ workspace: string }>;
};

export default async function WorkspaceDashboardPage({ params }: Props) {
  const { workspace: slug } = await params;
  const { workspace, membership } = await requireWorkspaceAccess(slug);

  const base = `/employer/${slug}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {workspace.name} Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Role:{" "}
            <span className="font-semibold text-primary">
              {membership?.role ?? "Member"}
            </span>{" "}
            · Status: <span className="font-semibold">{workspace.status}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`${base}/jobs/create`}
            className="rounded-md bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground shadow transition hover:bg-primary/90"
          >
            + Post Vacancy
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <span className="text-xs font-medium text-muted-foreground">
            Company Status
          </span>
          <div className="mt-2 text-lg font-bold text-foreground">
            {workspace.status}
          </div>
          <span className="mt-1 block text-xs text-muted-foreground">
            SSM: {workspace.ssmNumber ?? "N/A"}
          </span>
        </div>

        <Link
          href={`${base}/jobs`}
          className="rounded-xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/50"
        >
          <span className="text-xs font-medium text-muted-foreground">
            Active Jobs
          </span>
          <div className="mt-2 text-lg font-bold text-foreground">
            Manage Vacancies →
          </div>
          <span className="mt-1 block text-xs text-muted-foreground">
            View & edit listings
          </span>
        </Link>

        <Link
          href={`${base}/candidates`}
          className="rounded-xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/50"
        >
          <span className="text-xs font-medium text-muted-foreground">
            Candidates
          </span>
          <div className="mt-2 text-lg font-bold text-foreground">
            Applications →
          </div>
          <span className="mt-1 block text-xs text-muted-foreground">
            Review incoming resumes
          </span>
        </Link>

        <Link
          href={`${base}/interviews`}
          className="rounded-xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/50"
        >
          <span className="text-xs font-medium text-muted-foreground">
            Interviews
          </span>
          <div className="mt-2 text-lg font-bold text-foreground">
            Schedule →
          </div>
          <span className="mt-1 block text-xs text-muted-foreground">
            Upcoming interview slots
          </span>
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-base font-semibold text-foreground">
          Quick Navigation
        </h2>
        <div className="mt-4">
          <EmployerShortcuts />
        </div>
      </div>
    </div>
  );
}
