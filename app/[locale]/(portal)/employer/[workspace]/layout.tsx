import { forbidden, notFound } from "next/navigation";

import { requireWorkspaceAccess } from "@/features/companies/actions/workspace.query.server";
import { WorkspaceSidebar } from "@/features/companies/components/workspace-sidebar";

type WorkspaceLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ workspace: string; locale: string }>;
};

export default async function EmployerWorkspaceLayout({
  children,
  params,
}: WorkspaceLayoutProps) {
  const { workspace: workspaceSlug } = await params;

  const access = await requireWorkspaceAccess(workspaceSlug);

  if (!access.workspace) {
    notFound();
  }

  if (!access.isMember) {
    forbidden();
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <WorkspaceSidebar workspace={access.workspace} />
      <main className="flex-1 overflow-y-auto bg-background p-6">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
