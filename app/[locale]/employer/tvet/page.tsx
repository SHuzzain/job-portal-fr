import { getTranslations } from "next-intl/server"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { NavButton } from "@/components/nav-button"
import { SessionActions } from "@/features/auth/components/session-actions"
import { CreateRfpForm } from "@/features/tvet/components/create-rfp-form"
import { RfpList } from "@/features/tvet/components/rfp-list"
import { TvetGate } from "@/features/tvet/components/tvet-gate"

export default async function TvetPage() {
  const t = await getTranslations("TvetPage")

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-3">
        <NavButton href="/employer" variant="ghost">
          {t("back")}
        </NavButton>
        <div className="flex items-center gap-3">
          <SessionActions />
          <LocaleSwitcher />
        </div>
      </div>
      <div>
        <h1 className="font-medium">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>
      <TvetGate nextPath="/employer/tvet">
        <div>
          <NavButton href="/employer/tvet/claims" variant="outline">
            {t("financeClaims")}
          </NavButton>
        </div>
        <CreateRfpForm />
        <RfpList />
      </TvetGate>
    </div>
  )
}
