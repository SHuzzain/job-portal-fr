import { getTranslations } from "next-intl/server"
import { NavButton } from "@/components/nav-button"
import { PermissionGate } from "@/features/auth/components/permission-gate"
import { OrgAccessPanel } from "@/features/access/components/org-access-panel"

export default async function EmployerAccessPage() {
  const t = await getTranslations("Access")

  return (
    <div className="mx-auto flex min-h-svh max-w-5xl flex-col gap-6 p-6">
      <div>
        <NavButton href="/employer" variant="ghost">
          {t("backEmployer")}
        </NavButton>
      </div>
      <div>
        <h1 className="font-medium">{t("orgTitle")}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t("orgHint")}</p>
      </div>
      <PermissionGate resource="org_member" action="view">
        <OrgAccessPanel />
      </PermissionGate>
    </div>
  )
}
