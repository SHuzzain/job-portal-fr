import { OrgAccessPanel } from "@/features/access/components/org-access-panel";
import { PermissionGate } from "@/features/auth/components/permission-gate";

export default function CompanyStaffPage() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">
          Team Members & Invitations
        </h2>
        <p className="text-xs text-muted-foreground">
          Invite colleagues and manage assigned roles within this company.
        </p>
      </div>
      <PermissionGate resource="org_member" action="view">
        <OrgAccessPanel />
      </PermissionGate>
    </div>
  );
}
