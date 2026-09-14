import { getTranslations } from "next-intl/server"
import { NavButton } from "@/components/nav-button"
import { PermissionGate } from "@/features/auth/components/permission-gate"
import { PasakClaims } from "@/features/tvet-claims/components/pasak-claims"

export default async function PasakApprovalsPage() {
  const t = await getTranslations("TvetClaims")

  return (
    <div className="mx-auto flex min-h-svh max-w-3xl flex-col gap-6 p-6">
      <div>
        <NavButton href="/pasak" variant="ghost">
          {t("backPasak")}
        </NavButton>
      </div>
      <div>
        <h1 className="font-medium">{t("approvalsTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("approvalsHint")}
        </p>
      </div>
      <PermissionGate resource="claim_review" action="view">
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
      </PermissionGate>
    </div>
  )
}
