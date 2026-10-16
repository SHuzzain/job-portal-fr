import { PermissionGate } from "@/features/auth/components/permission-gate";
import { VacancyWizard } from "@/features/vacancies/components/vacancy-wizard";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ workspace: string }>;
};

export default async function CreateJobPage({ params }: Props) {
  const { workspace: slug } = await params;
  const base = `/employer/${slug}/jobs`;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href={base}
          className="inline-flex items-center text-xs font-medium text-muted-foreground transition hover:text-foreground"
        >
          ← Back to Vacancies
        </Link>
        <h1 className="mt-2 text-xl font-bold tracking-tight text-foreground">
          Create New Vacancy
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Fill in the vacancy details to submit for PASAK review and
          publication.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <PermissionGate resource="vacancy" action="create">
          <VacancyWizard />
        </PermissionGate>
      </div>
    </div>
  );
}
