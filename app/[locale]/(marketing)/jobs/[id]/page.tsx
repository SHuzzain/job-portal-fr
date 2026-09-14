import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import { NavButton } from "@/components/nav-button"
import { SessionGate } from "@/features/auth/components/session-gate"
import { ApplyForm } from "@/features/applications/components/apply-form"
import { getVacancy } from "@/features/vacancies/actions/vacancy.query.server"

type Props = {
  params: Promise<{ id: string }>
}

export default async function JobDetailPage({ params }: Props) {
  const t = await getTranslations("JobDetail")
  const { id } = await params
  const vacancy = await getVacancy(id).catch(() => null)

  if (!vacancy) {
    notFound()
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div>
        <NavButton href="/jobs" variant="ghost">
          {t("back")}
        </NavButton>
      </div>
      <article className="grid gap-2 text-sm">
        <h1 className="font-medium">{vacancy.title}</h1>
        <p className="text-muted-foreground">{vacancy.location}</p>
        <p>{vacancy.employmentType}</p>
        <p className="leading-relaxed">{vacancy.description}</p>
      </article>
      <SessionGate
        roles={["jobseeker", "admin", "super_admin"]}
        nextPath={`/jobs/${id}`}
      >
        <ApplyForm vacancy={vacancy} />
      </SessionGate>
    </div>
  )
}
