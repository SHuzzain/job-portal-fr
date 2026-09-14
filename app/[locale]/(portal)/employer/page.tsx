import { getTranslations } from "next-intl/server"
import { NavButton } from "@/components/nav-button"
import { SessionGate } from "@/features/auth/components/session-gate"
import { CompanySwitcher } from "@/features/companies/components/company-switcher"

export default async function EmployerPage() {
  const t = await getTranslations("EmployerPage")

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div>
        <NavButton href="/" variant="ghost">
          {t("back")}
        </NavButton>
      </div>
      <div className="grid gap-2 text-sm leading-loose">
        <h1 className="font-medium">{t("title")}</h1>
        <p>{t("subtitle")}</p>
      </div>
      <SessionGate roles={["employer", "admin", "super_admin"]} nextPath="/employer">
        <CompanySwitcher />
        <div className="flex flex-wrap gap-2">
          <NavButton href="/employer/companies/new">{t("registerCompany")}</NavButton>
          <NavButton href="/employer/vacancies">{t("vacancies")}</NavButton>
          <NavButton href="/employer/vacancies/new">{t("newVacancy")}</NavButton>
          <NavButton href="/employer/tvet" variant="outline">
            {t("tvet")}
          </NavButton>
        </div>
      </SessionGate>
    </div>
  )
}
