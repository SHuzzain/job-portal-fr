import { getTranslations } from "next-intl/server"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { NavButton } from "@/components/nav-button"
import { SessionActions } from "@/features/auth/components/session-actions"
import { SessionGate } from "@/features/auth/components/session-gate"
import { TvetSurveyForm } from "@/features/tvet/components/tvet-survey-form"

type Props = {
  params: Promise<{ id: string }>
}

export default async function TvetSurveyPage({ params }: Props) {
  const { id } = await params
  const t = await getTranslations("TvetSurvey")

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-3">
        <NavButton href="/seeker/scan" variant="ghost">
          {t("back")}
        </NavButton>
        <div className="flex items-center gap-3">
          <SessionActions />
          <LocaleSwitcher />
        </div>
      </div>
      <div>
        <h1 className="font-medium">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("hint")}</p>
      </div>
      <SessionGate
        roles={["jobseeker", "admin", "super_admin"]}
        nextPath={`/seeker/tvet/${id}/survey`}
      >
        <TvetSurveyForm sessionId={id} />
      </SessionGate>
    </div>
  )
}
