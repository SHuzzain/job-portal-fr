import { getTranslations } from "next-intl/server"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { NavButton } from "@/components/nav-button"
import { SessionActions } from "@/features/auth/components/session-actions"
import { SessionGate } from "@/features/auth/components/session-gate"
import { CompanySwitcher } from "@/features/companies/components/company-switcher"
import { EditVacancyForm } from "@/features/vacancies/components/edit-vacancy-form"

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditVacancyPage({ params }: Props) {
  const t = await getTranslations("EmployerVacancies")
  const { id } = await params

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-3">
        <NavButton href="/employer/vacancies" variant="ghost">
          {t("back")}
        </NavButton>
        <div className="flex items-center gap-3">
          <SessionActions />
          <LocaleSwitcher />
        </div>
      </div>
      <div>
        <h1 className="font-medium">{t("editTitle")}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t("editHint")}</p>
      </div>
      <SessionGate
        roles={["employer", "admin", "super_admin"]}
        nextPath={`/employer/vacancies/${id}/edit`}
      >
        <CompanySwitcher />
        <EditVacancyForm vacancyId={id} />
      </SessionGate>
    </div>
  )
}
