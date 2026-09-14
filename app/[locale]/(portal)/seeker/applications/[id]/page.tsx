import { getTranslations } from "next-intl/server"
import { NavButton } from "@/components/nav-button"
import { PermissionGate } from "@/features/auth/components/permission-gate"
import { ApplicationDetail } from "@/features/applications/components/application-detail"

type Props = {
  params: Promise<{ id: string }>
}

export default async function SeekerApplicationDetailPage({ params }: Props) {
  const t = await getTranslations("SeekerApplications")
  const { id } = await params

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div>
        <NavButton href="/seeker/applications" variant="ghost">
          {t("back")}
        </NavButton>
      </div>
      <div>
        <h1 className="font-medium">{t("detailTitle")}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t("detailHint")}</p>
      </div>
      <PermissionGate resource="seeker_application" action="view">
        <ApplicationDetail applicationId={id} />
      </PermissionGate>
    </div>
  )
}
