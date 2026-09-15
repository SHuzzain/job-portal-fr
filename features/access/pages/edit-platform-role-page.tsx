import { getTranslations } from "next-intl/server"
import { NavButton } from "@/components/nav-button"
import { PlatformRoleEditor } from "@/features/access/components/platform-role-editor"
import { PermissionGate } from "@/features/auth/components/permission-gate"

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditPlatformRolePage({ params }: Props) {
  const { id } = await params
  const t = await getTranslations("Access")

  return (
    <div className="mx-auto flex min-h-svh max-w-5xl flex-col gap-6 p-6">
      <div>
        <NavButton href="/pasak/access" variant="ghost">
          {t("backAccess")}
        </NavButton>
      </div>
      <div>
        <h1 className="font-medium">{t("editRole")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("editRoleHint")}
        </p>
      </div>
      <PermissionGate resource="platform_role" action="update">
        <PlatformRoleEditor id={id} />
      </PermissionGate>
    </div>
  )
}
