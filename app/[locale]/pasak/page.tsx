import { getTranslations } from "next-intl/server"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { NavButton } from "@/components/nav-button"
import { SessionActions } from "@/features/auth/components/session-actions"
import { SessionGate } from "@/features/auth/components/session-gate"

export default async function PasakPage() {
  const t = await getTranslations("Pasak")

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-3">
        <NavButton href="/" variant="ghost">
          {t("home")}
        </NavButton>
        <div className="flex items-center gap-3">
          <SessionActions />
          <LocaleSwitcher />
        </div>
      </div>
      <div>
        <h1 className="font-medium">{t("title")}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t("subtitle")}</p>
      </div>
      <SessionGate roles={["admin", "super_admin"]} nextPath="/pasak">
        <div className="flex flex-wrap gap-2">
          <NavButton href="/pasak/companies">{t("companies")}</NavButton>
          <NavButton href="/pasak/vacancies">{t("vacancies")}</NavButton>
          <NavButton href="/pasak/tvet">{t("tvet")}</NavButton>
        </div>
      </SessionGate>
    </div>
  )
}
