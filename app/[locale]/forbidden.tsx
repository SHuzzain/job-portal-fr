import { getTranslations } from "next-intl/server"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { NavButton } from "@/components/nav-button"
import { SessionActions } from "@/features/auth/components/session-actions"

export default async function ForbiddenPage() {
  const t = await getTranslations("Auth")

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-3">
        <NavButton href="/" variant="ghost">
          {t("home")}
        </NavButton>
        <div className="flex items-center gap-3">
          <SessionActions />
          <LocaleSwitcher />
        </div>
      </div>
      <div className="grid gap-3 text-sm">
        <h1 className="font-medium">{t("forbiddenTitle")}</h1>
        <p>{t("forbidden")}</p>
      </div>
    </div>
  )
}
