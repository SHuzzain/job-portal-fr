import { ApplicationList } from "@/features/applications/components/application-list";
import { PermissionGate } from "@/features/auth/components/permission-gate";

export default function CandidatesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Candidates & Applications
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Track and evaluate candidate submissions across your active job
          postings.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <PermissionGate resource="applicant" action="view">
          <ApplicationList />
        </PermissionGate>
      </div>
    </div>
  );
}
