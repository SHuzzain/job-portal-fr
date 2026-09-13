import { getTranslations } from "next-intl/server"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { NavButton } from "@/components/nav-button"
import { listApprovedVacancies } from "@/features/vacancies/actions/vacancy.query.server"
import { JobFilters } from "@/features/vacancies/components/job-filters"
import { VacancyCard } from "@/features/vacancies/components/vacancy-card"

type Props = {
  searchParams: Promise<{ q?: string; location?: string; employmentType?: string }>
}

export default async function JobsPage({ searchParams }: Props) {
  const t = await getTranslations("JobsPage")
  const filters = await searchParams
  const vacancies = await listApprovedVacancies(filters).catch(() => [])

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-3">
        <NavButton href="/" variant="ghost">
          {t("back")}
        </NavButton>
        <LocaleSwitcher />
      </div>
      <div>
        <h1 className="font-medium">{t("title")}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t("empty")}</p>
      </div>
      <JobFilters
        q={filters.q}
        location={filters.location}
        employmentType={filters.employmentType}
      />
      {vacancies.length > 0 ? (
        <div className="grid gap-3">
          {vacancies.map((vacancy) => (
            <VacancyCard key={vacancy.id} vacancy={vacancy} href={`/jobs/${vacancy.id}`} />
          ))}
        </div>
      ) : null}
    </div>
  )
}
