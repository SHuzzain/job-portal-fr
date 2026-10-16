"use client";

import { useTranslations } from "next-intl";

import { NavButton } from "@/components/nav-button";
import { authClient } from "@/connector";
import { activeWorkspaceOf } from "@/features/auth/lib/workspace";

export function EmployerShortcuts() {
  const t = useTranslations("EmployerPage");
  const { data: session } = authClient.useSession();
  const { data: activeOrg } = authClient.useActiveOrganization();
  const workspace = activeWorkspaceOf(session?.user);

  const base = activeOrg?.slug ? `/employer/${activeOrg.slug}` : "/employer";

  if (workspace === "training_provider") {
    return (
      <div className="flex flex-wrap gap-2">
        <NavButton href={`${base}/tvet`}>{t("tvet")}</NavButton>
        <NavButton href={`${base}/finance/reports`} variant="outline">
          {t("tvetClaims")}
        </NavButton>
        <NavButton href={`${base}/company/roles`} variant="outline">
          {t("access")}
        </NavButton>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <NavButton href={`${base}/jobs`}>{t("vacancies")}</NavButton>
      <NavButton href={`${base}/jobs/create`}>{t("newVacancy")}</NavButton>
      <NavButton href={`${base}/candidates`} variant="outline">
        Candidates
      </NavButton>
      <NavButton href={`${base}/company/profile`} variant="outline">
        Company Settings
      </NavButton>
      <NavButton href={`${base}/company/roles`} variant="outline">
        {t("access")}
      </NavButton>
    </div>
  );
}
