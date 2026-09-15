import { getTranslations } from "next-intl/server"
import { NavButton } from "@/components/nav-button"
import { PermissionGate } from "@/features/auth/components/permission-gate"
import { TvetSurveyForm } from "@/features/tvet/components/tvet-survey-form"

type Props = {
  params: Promise<{ id: string }>
}

export default async function TvetSurveyPage({ params }: Props) {
  const { id } = await params
  const t = await getTranslations("TvetSurvey")

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div>
        <NavButton href="/seeker/scan" variant="ghost">
          {t("back")}
        </NavButton>
      </div>
      <div>
        <h1 className="font-medium">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("hint")}</p>
      </div>
      <PermissionGate resource="tvet_certificate" action="submit_survey">
        <TvetSurveyForm sessionId={id} />
      </PermissionGate>
    </div>
  )
}
