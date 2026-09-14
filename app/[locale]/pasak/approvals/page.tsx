import { getTranslations } from "next-intl/server"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { NavButton } from "@/components/nav-button"
import { SessionActions } from "@/features/auth/components/session-actions"
import { SessionGate } from "@/features/auth/components/session-gate"
import { PasakClaims } from "@/features/tvet-claims/components/pasak-claims"

export default async function PasakApprovalsPage() {
  const t = await getTranslations("TvetClaims")

  return (
    <div className="mx-auto flex min-h-svh max-w-3xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-3">
        <NavButton href="/pasak" variant="ghost">
          {t("backPasak")}
        </NavButton>
        <div className="flex items-center gap-3">
          <SessionActions />
          <LocaleSwitcher />
        </div>
      </div>
      <div>
        <h1 className="font-medium">{t("approvalsTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("approvalsHint")}
        </p>
      </div>
      <SessionGate roles={["admin", "super_admin"]} nextPath="/pasak/approvals">
        <nav className="flex flex-wrap gap-2" aria-label={t("approvalTabs")}>
          <NavButton href="/pasak/companies" variant="outline">
            {t("companiesTab")}
          </NavButton>
          <NavButton href="/pasak/vacancies" variant="outline">
            {t("vacanciesTab")}
          </NavButton>
          <NavButton href="/pasak/approvals">{t("claimsTab")}</NavButton>
        </nav>
        <PasakClaims />
      </SessionGate>
    </div>
  )
}
