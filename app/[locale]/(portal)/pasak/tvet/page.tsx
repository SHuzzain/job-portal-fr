import { getTranslations } from "next-intl/server"
import { NavButton } from "@/components/nav-button"
import { SessionGate } from "@/features/auth/components/session-gate"
import { TvetCapabilityQueue } from "@/features/pasak/components/tvet-capability-queue"

export default async function PasakTvetPage() {
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
        <p className="text-muted-foreground mt-1 text-sm">{t("tvetHint")}</p>
      </div>
      <SessionGate roles={["admin", "super_admin"]} nextPath="/pasak/tvet">
        <TvetCapabilityQueue />
      </SessionGate>
    </div>
  )
}
