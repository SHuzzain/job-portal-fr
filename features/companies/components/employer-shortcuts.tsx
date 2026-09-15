"use client";

import { useTranslations } from "next-intl";

import { NavButton } from "@/components/nav-button";
import { authClient } from "@/connector";
import { activeWorkspaceOf } from "@/features/auth/lib/workspace";

export function EmployerShortcuts() {
  const t = useTranslations("EmployerPage");
  const { data } = authClient.useSession();
  const workspace = activeWorkspaceOf(data?.user);

  if (workspace === "training_provider") {
    return (
      <div className="flex flex-wrap gap-2">
        <NavButton href="/employer/tvet">{t("tvet")}</NavButton>
        <NavButton href="/employer/tvet/claims" variant="outline">
          {t("tvetClaims")}
        </NavButton>
        <NavButton href="/employer/access" variant="outline">
          {t("access")}
        </NavButton>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <NavButton href="/employer/companies/new">
        {t("registerCompany")}
      </NavButton>
      <NavButton href="/employer/vacancies">{t("vacancies")}</NavButton>
      <NavButton href="/employer/vacancies/new">{t("newVacancy")}</NavButton>
      <NavButton href="/employer/access" variant="outline">
        {t("access")}
      </NavButton>
    </div>
  );
}
