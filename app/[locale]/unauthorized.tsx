"use client"

import { useTranslations } from "next-intl"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { NavButton } from "@/components/nav-button"
import { usePathname } from "@/i18n/navigation"

export default function UnauthorizedPage() {
  const t = useTranslations("Auth")
  const pathname = usePathname()

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-3">
        <NavButton href="/" variant="ghost">
          {t("home")}
        </NavButton>
        <LocaleSwitcher />
      </div>
      <div className="grid gap-3 text-sm">
        <h1 className="font-medium">{t("unauthorizedTitle")}</h1>
        <p>{t("required")}</p>
        <div className="flex flex-wrap gap-2">
          <NavButton href={`/sign-in?next=${encodeURIComponent(pathname)}`}>
            {t("signIn")}
          </NavButton>
          <NavButton href="/sign-up" variant="outline">
            {t("signUp")}
          </NavButton>
        </div>
      </div>
    </div>
  )
}
