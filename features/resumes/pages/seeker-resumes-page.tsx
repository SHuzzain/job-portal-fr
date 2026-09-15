import { getTranslations } from "next-intl/server"
import { NavButton } from "@/components/nav-button"
import { PermissionGate } from "@/features/auth/components/permission-gate"
import { ResumeManager } from "@/features/resumes/components/resume-manager"

export default async function SeekerResumesPage() {
  const t = await getTranslations("SeekerResumes")

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div>
        <NavButton href="/seeker" variant="ghost">
          {t("back")}
        </NavButton>
      </div>
      <div>
        <h1 className="font-medium">{t("pageTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("pageHint")}</p>
      </div>
      <PermissionGate resource="resume" action="view">
        <ResumeManager />
      </PermissionGate>
    </div>
  )
}
