import { PermissionGate } from "@/features/auth/components/permission-gate";

export default function WorkspaceInterviewsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Interview Schedules
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Manage upcoming candidate interview appointments and schedule updates.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <PermissionGate resource="interview" action="view">
          <div className="py-8 text-center text-sm text-muted-foreground">
            Interview management pipeline for this workspace.
          </div>
        </PermissionGate>
      </div>
    </div>
  );
}
