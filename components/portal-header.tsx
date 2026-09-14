import { getTranslations } from "next-intl/server"
import { NavButton } from "@/components/nav-button"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { SessionActions } from "@/features/auth/components/session-actions"

export async function PortalHeader() {
  const t = await getTranslations("Nav")

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
      <nav
        className="flex flex-wrap items-center gap-2"
        aria-label={t("portal")}
      >
        <NavButton href="/" variant="ghost">
          {t("home")}
        </NavButton>
        <NavButton href="/seeker" variant="ghost">
          {t("seeker")}
        </NavButton>
        <NavButton href="/employer" variant="ghost">
          {t("employer")}
        </NavButton>
        <NavButton href="/pasak" variant="ghost">
          {t("pasak")}
        </NavButton>
      </nav>
      <div className="flex flex-wrap items-center gap-2">
        <SessionActions />
        <LocaleSwitcher />
      </div>
    </header>
  )
}
