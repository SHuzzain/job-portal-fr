import { getTranslations } from "next-intl/server"
import { NavButton } from "@/components/nav-button"
import { SessionGate } from "@/features/auth/components/session-gate"
import { CompanySwitcher } from "@/features/companies/components/company-switcher"
import { StaleSweepButton } from "@/features/applications/components/stale-sweep-button"
import { EmployerVacancyList } from "@/features/vacancies/components/employer-vacancy-list"

export default async function EmployerVacanciesPage() {
  const t = await getTranslations("EmployerVacancies")

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div>
        <NavButton href="/employer" variant="ghost">
          {t("back")}
        </NavButton>
      </div>
      <div>
        <h1 className="font-medium">{t("title")}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t("hint")}</p>
      </div>
      <SessionGate roles={["employer", "admin", "super_admin"]} nextPath="/employer/vacancies">
        <CompanySwitcher />
        <div className="flex flex-wrap gap-2">
          <NavButton href="/employer/vacancies/new">{t("newVacancy")}</NavButton>
          <StaleSweepButton />
        </div>
        <EmployerVacancyList />
      </SessionGate>
    </div>
  )
}
