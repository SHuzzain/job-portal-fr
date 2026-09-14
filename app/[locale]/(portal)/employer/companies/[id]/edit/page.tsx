import { getTranslations } from "next-intl/server"
import { NavButton } from "@/components/nav-button"
import { PermissionGate } from "@/features/auth/components/permission-gate"
import { EditCompanyForm } from "@/features/companies/components/edit-company-form"

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditCompanyPage({ params }: Props) {
  const t = await getTranslations("Company")
  const { id } = await params

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div>
        <NavButton href="/employer" variant="ghost">
          {t("back")}
        </NavButton>
      </div>
      <div>
        <h1 className="font-medium">{t("editTitle")}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t("editHint")}</p>
      </div>
      <PermissionGate resource="company" action="update">
        <EditCompanyForm organizationId={id} />
      </PermissionGate>
    </div>
  )
}
