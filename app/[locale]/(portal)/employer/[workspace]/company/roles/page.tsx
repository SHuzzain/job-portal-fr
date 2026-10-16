import { OrgAccessPanel } from "@/features/access/components/org-access-panel";
import { PermissionGate } from "@/features/auth/components/permission-gate";

export default function CompanyRolesPage() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">
          Organization Roles & Permissions
        </h2>
        <p className="text-xs text-muted-foreground">
          Define custom roles and action matrices for your workspace members.
        </p>
      </div>
      <PermissionGate resource="org_role" action="view">
        <OrgAccessPanel />
      </PermissionGate>
    </div>
  );
}
