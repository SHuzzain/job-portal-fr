import { PermissionGate } from "@/features/auth/components/permission-gate";

export default function WorkspaceFinanceReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Finance & Claims
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          View claim reports, incentive disbursements, and financial
          settlements.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <PermissionGate resource="tvet_claim" action="view">
          <div className="py-8 text-center text-sm text-muted-foreground">
            Financial reports and submitted claims for this workspace.
          </div>
        </PermissionGate>
      </div>
    </div>
  );
}
