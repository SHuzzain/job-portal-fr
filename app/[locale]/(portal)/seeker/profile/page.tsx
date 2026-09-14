import { getTranslations } from "next-intl/server"
import { NavButton } from "@/components/nav-button"
import { PermissionGate } from "@/features/auth/components/permission-gate"
import { ProfileWizard } from "@/features/profile/components/profile-wizard"

export default async function SeekerProfilePage() {
  const t = await getTranslations("SeekerProfile")

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div>
        <NavButton href="/seeker" variant="ghost">
          {t("back")}
        </NavButton>
      </div>
      <div>
        <h1 className="font-medium">{t("pageTitle")}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t("pageHint")}</p>
      </div>
      <PermissionGate resource="seeker_profile" action="view">
        <ProfileWizard />
      </PermissionGate>
    </div>
  )
}
