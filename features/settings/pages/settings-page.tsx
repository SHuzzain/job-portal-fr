import { getTranslations } from "next-intl/server"
import { NavButton } from "@/components/nav-button"
import { SettingsTabsPanel } from "@/features/settings/components/settings-tabs-panel"

export default async function SettingsPage() {
  const t = await getTranslations("Settings")

  return (
    <div className="mx-auto flex min-h-svh max-w-3xl flex-col gap-6 p-6">
      <div>
        <NavButton href="/" variant="ghost">
          {t("back")}
        </NavButton>
      </div>
      <div>
        <h1 className="font-medium">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("hint")}</p>
      </div>
      <SettingsTabsPanel />
    </div>
  )
}
