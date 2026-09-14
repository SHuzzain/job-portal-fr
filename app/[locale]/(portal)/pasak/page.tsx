import { getTranslations } from "next-intl/server"
import { NavButton } from "@/components/nav-button"
import { SessionGate } from "@/features/auth/components/session-gate"

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
      <SessionGate roles={["admin", "super_admin"]} nextPath="/pasak">
        <div className="flex flex-wrap gap-2">
          <NavButton href="/pasak/companies">{t("companies")}</NavButton>
          <NavButton href="/pasak/vacancies">{t("vacancies")}</NavButton>
          <NavButton href="/pasak/tvet">{t("tvet")}</NavButton>
          <NavButton href="/pasak/approvals">{t("approvals")}</NavButton>
        </div>
      </SessionGate>
    </div>
  )
}
