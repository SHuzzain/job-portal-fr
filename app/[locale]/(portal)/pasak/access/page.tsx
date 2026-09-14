import { getTranslations } from "next-intl/server"
import { NavButton } from "@/components/nav-button"
import { SessionGate } from "@/features/auth/components/session-gate"
import { AdminAccessPanel } from "@/features/access/components/admin-access-panel"

export default async function PasakAccessPage() {
  const t = await getTranslations("Access")

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div>
        <NavButton href="/pasak" variant="ghost">
          {t("backPasak")}
        </NavButton>
      </div>
      <div>
        <h1 className="font-medium">{t("adminTitle")}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t("adminHint")}</p>
      </div>
      <SessionGate roles={["admin", "super_admin"]} nextPath="/pasak/access">
        <AdminAccessPanel />
      </SessionGate>
    </div>
  )
}
