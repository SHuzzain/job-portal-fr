import { getTranslations } from "next-intl/server";

import { NavButton } from "@/components/nav-button";
import { StaleSweepButton } from "@/features/applications/components/stale-sweep-button";
import { PermissionGate } from "@/features/auth/components/permission-gate";
import { CompanySwitcher } from "@/features/companies/components/company-switcher";
import { EmployerVacancyList } from "@/features/vacancies/components/employer-vacancy-list";

export default async function EmployerVacanciesPage() {
  const t = await getTranslations("EmployerVacancies");

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div>
        <NavButton href="/employer" variant="ghost">
          {t("back")}
        </NavButton>
      </div>
      <div>
        <h1 className="font-medium">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("hint")}</p>
      </div>
      <PermissionGate resource="vacancy" action="view">
        <CompanySwitcher />
        <div className="flex flex-wrap gap-2">
          <NavButton href="/employer/vacancies/new">
            {t("newVacancy")}
          </NavButton>
          <StaleSweepButton />
        </div>
        <EmployerVacancyList />
      </PermissionGate>
    </div>
  );
}
