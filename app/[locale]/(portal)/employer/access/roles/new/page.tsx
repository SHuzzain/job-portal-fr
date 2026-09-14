import { getTranslations } from "next-intl/server"
import { NavButton } from "@/components/nav-button"
import { OrgRoleForm } from "@/features/access/components/org-role-form"
import { PermissionGate } from "@/features/auth/components/permission-gate"

export default async function NewOrgRolePage() {
  const t = await getTranslations("Access")

  return (
    <div className="mx-auto flex min-h-svh max-w-5xl flex-col gap-6 p-6">
      <div>
        <NavButton href="/employer/access" variant="ghost">
          {t("backAccess")}
        </NavButton>
      </div>
      <div>
        <h1 className="font-medium">{t("createRole")}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t("orgRoleHint")}</p>
      </div>
      <PermissionGate resource="org_role" action="create">
        <OrgRoleForm />
      </PermissionGate>
    </div>
  )
}
