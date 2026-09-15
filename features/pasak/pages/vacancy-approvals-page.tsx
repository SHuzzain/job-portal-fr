import { getTranslations } from "next-intl/server"
import { NavButton } from "@/components/nav-button"
import { PermissionGate } from "@/features/auth/components/permission-gate"
import { VacancyQueue } from "@/features/pasak/components/vacancy-queue"

export default async function VacancyApprovalsPage() {
  const t = await getTranslations("Pasak")

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div>
        <NavButton href="/pasak" variant="ghost">
          {t("back")}
        </NavButton>
      </div>
      <div>
        <h1 className="font-medium">{t("vacanciesTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("vacanciesHint")}
        </p>
      </div>
      <PermissionGate resource="vacancy_review" action="view">
        <VacancyQueue />
      </PermissionGate>
    </div>
  )
}
