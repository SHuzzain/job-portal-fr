import { getTranslations } from "next-intl/server"
import { NavButton } from "@/components/nav-button"
import { PermissionGate } from "@/features/auth/components/permission-gate"
import { CompanySwitcher } from "@/features/companies/components/company-switcher"
import { EmployerShortcuts } from "@/features/companies/components/employer-shortcuts"

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
      <PermissionGate resource="company" action="view">
        <CompanySwitcher />
        <EmployerShortcuts />
      </PermissionGate>
    </div>
  )
}
