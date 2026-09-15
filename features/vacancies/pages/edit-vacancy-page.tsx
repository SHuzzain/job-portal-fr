import { getTranslations } from "next-intl/server"
import { NavButton } from "@/components/nav-button"
import { PermissionGate } from "@/features/auth/components/permission-gate"
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
      <div>
        <NavButton href="/employer/vacancies" variant="ghost">
          {t("back")}
        </NavButton>
      </div>
      <div>
        <h1 className="font-medium">{t("editTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("editHint")}</p>
      </div>
      <PermissionGate resource="vacancy" action="update">
        <CompanySwitcher />
        <EditVacancyForm vacancyId={id} />
      </PermissionGate>
    </div>
  )
}
