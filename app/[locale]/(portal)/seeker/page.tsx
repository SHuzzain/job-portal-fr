import { getTranslations } from "next-intl/server";

import { NavButton } from "@/components/nav-button";
import { PermissionGate } from "@/features/auth/components/permission-gate";

export default async function SeekerPage() {
  const t = await getTranslations("SeekerPage");

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div>
        <NavButton href="/" variant="ghost">
          {t("back")}
        </NavButton>
      </div>
      <div>
        <h1 className="font-medium">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>
      <PermissionGate resource="seeker_profile" action="view">
        <div className="flex flex-wrap gap-2">
          <NavButton href="/seeker/profile">{t("profile")}</NavButton>
          <NavButton href="/seeker/resumes">{t("resumes")}</NavButton>
          <NavButton href="/seeker/applications">{t("applications")}</NavButton>
          <NavButton href="/seeker/scan">{t("scan")}</NavButton>
          <NavButton href="/jobs" variant="outline">
            {t("jobs")}
          </NavButton>
        </div>
      </PermissionGate>
    </div>
  );
}
