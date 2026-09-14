import { getTranslations } from "next-intl/server"
import { NavButton } from "@/components/nav-button"
import { SessionGate } from "@/features/auth/components/session-gate"
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
        <p className="text-muted-foreground mt-1 text-sm">{t("pageHint")}</p>
      </div>
      <SessionGate roles={["employer", "admin", "super_admin"]} nextPath="/employer/companies/new">
        <RegisterCompanyForm />
      </SessionGate>
    </div>
  )
}
