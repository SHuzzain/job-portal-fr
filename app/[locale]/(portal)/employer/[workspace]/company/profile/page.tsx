import { PermissionGate } from "@/features/auth/components/permission-gate";
import { requireWorkspaceAccess } from "@/features/companies/actions/workspace.query.server";
import { EditCompanyForm } from "@/features/companies/components/edit-company-form";

type Props = {
  params: Promise<{ workspace: string }>;
};

export default async function CompanyProfilePage({ params }: Props) {
  const { workspace: slug } = await params;
  const { workspace } = await requireWorkspaceAccess(slug);

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">
          Company Profile
        </h2>
        <p className="text-xs text-muted-foreground">
          Update your organization profile, registration details, and documents.
        </p>
      </div>
      <PermissionGate resource="company" action="update">
        <EditCompanyForm organizationId={workspace.id} />
      </PermissionGate>
    </div>
  );
}
