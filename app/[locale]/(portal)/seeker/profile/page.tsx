import { getTranslations } from "next-intl/server"
import { NavButton } from "@/components/nav-button"
import { SessionGate } from "@/features/auth/components/session-gate"
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
      <SessionGate roles={["jobseeker", "admin", "super_admin"]} nextPath="/seeker/profile">
        <ProfileWizard />
      </SessionGate>
    </div>
  )
}
