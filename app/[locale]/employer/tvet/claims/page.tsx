import { getTranslations } from "next-intl/server"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { NavButton } from "@/components/nav-button"
import { SessionActions } from "@/features/auth/components/session-actions"
import { ProviderClaims } from "@/features/tvet-claims/components/provider-claims"
import { TvetGate } from "@/features/tvet/components/tvet-gate"

export default async function EmployerTvetClaimsPage() {
  const t = await getTranslations("TvetClaims")

  return (
    <div className="mx-auto flex min-h-svh max-w-3xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-3">
        <NavButton href="/employer/tvet" variant="ghost">
          {t("backTvet")}
        </NavButton>
        <div className="flex items-center gap-3">
          <SessionActions />
          <LocaleSwitcher />
        </div>
      </div>
      <div>
        <h1 className="font-medium">{t("providerTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("providerHint")}
        </p>
      </div>
      <TvetGate nextPath="/employer/tvet/claims">
        <ProviderClaims />
      </TvetGate>
    </div>
  )
}
