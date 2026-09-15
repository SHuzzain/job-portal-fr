import { getTranslations } from "next-intl/server"
import { NavButton } from "@/components/nav-button"
import { CreateRfpForm } from "@/features/tvet/components/create-rfp-form"
import { RfpList } from "@/features/tvet/components/rfp-list"
import { TvetGate } from "@/features/tvet/components/tvet-gate"

export default async function EmployerTvetPage() {
  const t = await getTranslations("TvetPage")

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div>
        <NavButton href="/employer" variant="ghost">
          {t("back")}
        </NavButton>
      </div>
      <div>
        <h1 className="font-medium">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>
      <TvetGate resource="tvet_rfp" action="view">
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
