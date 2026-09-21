import { redirect } from "next/navigation";

import { getTranslations } from "next-intl/server";

import { NavButton } from "@/components/nav-button";
import { requireAuth } from "@/features/auth/actions/auth.query.server";
import { listUserWorkspaces } from "@/features/companies/actions/workspace.query.server";
import { RegisterCompanyForm } from "@/features/companies/components/register-company-form";

export default async function EmployerRootPage() {
  const t = await getTranslations("EmployerPage");
  const session = await requireAuth();

  const workspaces = await listUserWorkspaces();

  // If user already belongs to an organization, redirect to its dashboard
  if (workspaces.length > 0) {
    const activeId = session.session.activeOrganizationId;
    const activeOrg =
      workspaces.find((org) => org.id === activeId) ?? workspaces[0];
    if (activeOrg?.slug) {
      redirect(`/employer/${activeOrg.slug}/dashboard`);
    }
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div>
        <NavButton href="/" variant="ghost">
          {t("back")}
        </NavButton>
      </div>
      <div className="grid gap-2 text-sm leading-loose">
        <h1 className="text-xl font-semibold">Welcome to Employer Portal</h1>
        <p className="text-muted-foreground">
          You do not have an active company workspace yet. Register your company
          below to get started with posting vacancies and managing applicants.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 font-medium">Register New Company</h2>
        <RegisterCompanyForm />
      </div>
    </div>
  );
}
