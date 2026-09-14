import { getTranslations } from "next-intl/server"
import { NavButton } from "@/components/nav-button"
import { PermissionGate } from "@/features/auth/components/permission-gate"

export default async function PasakPage() {
  const t = await getTranslations("Pasak")

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div>
        <NavButton href="/" variant="ghost">
          {t("home")}
        </NavButton>
      </div>
      <div>
        <h1 className="font-medium">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>
      <PermissionGate resource="company_review" action="view">
        <div className="flex flex-wrap gap-2">
          <NavButton href="/pasak/companies">{t("companies")}</NavButton>
          <NavButton href="/pasak/vacancies">{t("vacancies")}</NavButton>
          <NavButton href="/pasak/tvet">{t("tvet")}</NavButton>
          <NavButton href="/pasak/approvals">{t("approvals")}</NavButton>
          <NavButton href="/pasak/access">{t("access")}</NavButton>
        </div>
      </PermissionGate>
    </div>
  )
}
