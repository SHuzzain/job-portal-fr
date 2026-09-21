import { PermissionGate } from "@/features/auth/components/permission-gate";
import { EditVacancyForm } from "@/features/vacancies/components/edit-vacancy-form";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ id: string; workspace: string }>;
};

export default async function EditWorkspaceJobPage({ params }: Props) {
  const { id, workspace: slug } = await params;
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
          Edit Vacancy
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Update vacancy information or address review feedback before
          resubmitting.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <PermissionGate resource="vacancy" action="update">
          <EditVacancyForm vacancyId={id} />
        </PermissionGate>
      </div>
    </div>
  );
}
