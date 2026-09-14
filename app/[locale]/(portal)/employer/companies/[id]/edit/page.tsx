import { getTranslations } from "next-intl/server"
import { NavButton } from "@/components/nav-button"
import { SessionGate } from "@/features/auth/components/session-gate"
import { EditCompanyForm } from "@/features/companies/components/edit-company-form"

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditCompanyPage({ params }: Props) {
  const t = await getTranslations("Company")
  const { id } = await params

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div>
        <NavButton href="/employer" variant="ghost">
          {t("back")}
        </NavButton>
      </div>
      <div>
        <h1 className="font-medium">{t("editTitle")}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t("editHint")}</p>
      </div>
      <SessionGate
        roles={["employer", "admin", "super_admin"]}
        nextPath={`/employer/companies/${id}/edit`}
      >
        <EditCompanyForm organizationId={id} />
      </SessionGate>
    </div>
  )
}
