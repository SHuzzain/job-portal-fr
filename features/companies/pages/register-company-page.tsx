import { getTranslations } from "next-intl/server"
import { NavButton } from "@/components/nav-button"
import { PermissionGate } from "@/features/auth/components/permission-gate"
import { RegisterCompanyForm } from "@/features/companies/components/register-company-form"

export default async function RegisterCompanyPage() {
  const t = await getTranslations("Company")

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div>
        <NavButton href="/employer" variant="ghost">
          {t("back")}
        </NavButton>
      </div>
      <div>
        <h1 className="font-medium">{t("pageTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("pageHint")}</p>
      </div>
      <PermissionGate resource="company" action="create">
        <RegisterCompanyForm />
      </PermissionGate>
    </div>
  )
}
