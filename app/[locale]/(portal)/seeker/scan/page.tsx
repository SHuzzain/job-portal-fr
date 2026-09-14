import { getTranslations } from "next-intl/server"
import { NavButton } from "@/components/nav-button"
import { PermissionGate } from "@/features/auth/components/permission-gate"
import { ScanForm } from "@/features/tvet/components/scan-form"

export default async function SeekerScanPage() {
  const t = await getTranslations("TvetScan")

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div>
        <NavButton href="/seeker" variant="ghost">
          {t("back")}
        </NavButton>
      </div>
      <div>
        <h1 className="font-medium">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("hint")}</p>
      </div>
      <PermissionGate resource="tvet_attendance" action="scan">
        <ScanForm />
      </PermissionGate>
    </div>
  )
}
