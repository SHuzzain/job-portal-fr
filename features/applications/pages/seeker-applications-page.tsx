import { getTranslations } from "next-intl/server";

import { NavButton } from "@/components/nav-button";
import { ApplicationList } from "@/features/applications/components/application-list";
import { PermissionGate } from "@/features/auth/components/permission-gate";

export default async function SeekerApplicationsPage() {
  const t = await getTranslations("SeekerApplications");

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div>
        <NavButton href="/seeker" variant="ghost">
          {t("back")}
        </NavButton>
      </div>
      <div>
        <h1 className="font-medium">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("hint")}</p>
      </div>
      <PermissionGate resource="seeker_application" action="view">
        <ApplicationList />
      </PermissionGate>
    </div>
  );
}
