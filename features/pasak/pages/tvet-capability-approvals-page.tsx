import { getTranslations } from "next-intl/server"
import { NavButton } from "@/components/nav-button"
import { PermissionGate } from "@/features/auth/components/permission-gate"
import { TvetCapabilityQueue } from "@/features/pasak/components/tvet-capability-queue"

export default async function TvetCapabilityApprovalsPage() {
  const t = await getTranslations("Pasak")

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div>
        <NavButton href="/pasak" variant="ghost">
          {t("back")}
        </NavButton>
      </div>
      <div>
        <h1 className="font-medium">{t("tvetTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("tvetHint")}</p>
      </div>
      <PermissionGate resource="tvet_capability" action="view">
        <TvetCapabilityQueue />
      </PermissionGate>
    </div>
  )
}
