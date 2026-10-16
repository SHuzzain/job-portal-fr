import { PermissionGate } from "@/features/auth/components/permission-gate";

export default function WorkspaceTvetPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          TVET Training Provider Workspace
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Manage training RFPs, trainee sessions, attendance scans, and claim
          submissions.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <PermissionGate resource="tvet_session" action="view">
          <div className="py-8 text-center text-sm text-muted-foreground">
            TVET training sessions and programs for this provider workspace.
          </div>
        </PermissionGate>
      </div>
    </div>
  );
}
