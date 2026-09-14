import { getTranslations } from "next-intl/server"
import { NavButton } from "@/components/nav-button"
import { SessionGate } from "@/features/auth/components/session-gate"
import { VacancyQueue } from "@/features/pasak/components/vacancy-queue"

export default async function PasakVacanciesPage() {
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
        <p className="text-muted-foreground mt-1 text-sm">{t("vacanciesHint")}</p>
      </div>
      <SessionGate roles={["admin", "super_admin"]} nextPath="/pasak/vacancies">
        <VacancyQueue />
      </SessionGate>
    </div>
  )
}
