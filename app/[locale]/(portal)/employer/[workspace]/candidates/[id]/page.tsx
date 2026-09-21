import { ApplicationDetail } from "@/features/applications/components/application-detail";
import { PermissionGate } from "@/features/auth/components/permission-gate";

type Props = {
  params: Promise<{ id: string; workspace: string }>;
};

export default async function CandidateDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <PermissionGate resource="applicant" action="view">
          <ApplicationDetail applicationId={id} />
        </PermissionGate>
      </div>
    </div>
  );
}
