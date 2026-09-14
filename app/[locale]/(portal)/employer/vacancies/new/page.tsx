import { getTranslations } from "next-intl/server"
import { NavButton } from "@/components/nav-button"
import { PermissionGate } from "@/features/auth/components/permission-gate"
import { CompanySwitcher } from "@/features/companies/components/company-switcher"
import { VacancyWizard } from "@/features/vacancies/components/vacancy-wizard"

export default async function NewVacancyPage() {
  const t = await getTranslations("CreateVacancy")

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div>
        <NavButton href="/employer/vacancies" variant="ghost">
          {t("back")}
        </NavButton>
      </div>
      <div>
        <h1 className="font-medium">{t("pageTitle")}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t("pageHint")}</p>
      </div>
      <PermissionGate resource="vacancy" action="create">
        <CompanySwitcher />
        <VacancyWizard />
      </PermissionGate>
    </div>
  )
}
