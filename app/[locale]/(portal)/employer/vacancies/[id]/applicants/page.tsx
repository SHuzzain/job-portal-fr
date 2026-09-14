import { getTranslations } from "next-intl/server"
import { NavButton } from "@/components/nav-button"
import { SessionGate } from "@/features/auth/components/session-gate"
import { VacancyApplicantList } from "@/features/applications/components/vacancy-applicant-list"

type Props = {
  params: Promise<{ id: string }>
}

export default async function VacancyApplicantsPage({ params }: Props) {
  const t = await getTranslations("EmployerApplicants")
  const { id } = await params

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div>
        <NavButton href="/employer/vacancies" variant="ghost">
          {t("back")}
        </NavButton>
      </div>
      <div>
        <h1 className="font-medium">{t("title")}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t("hint")}</p>
      </div>
      <SessionGate
        roles={["employer", "admin", "super_admin"]}
        nextPath={`/employer/vacancies/${id}/applicants`}
      >
        <VacancyApplicantList vacancyId={id} />
      </SessionGate>
    </div>
  )
}
